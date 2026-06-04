import { Inject, Injectable } from "@nestjs/common";
import { UserProviderPort } from "../../ports/user-provider.port";
import { TokenSignerPort } from "../../ports/token-signer.port";
import { RefreshTokenFamily } from "../../../domain/entities/refresh-token-family.entity";
import { IdGeneratorPort } from "../../ports/id-generator.port";
import { InfoIpAddressPort } from "../../ports/info-ip-address.port";
import { Device, DeviceType } from "../../../domain/entities/device.entity";
import { DeviceLocation } from "../../../domain/value-objects/device-location.vo";
import { UserAgentParsePort } from "../../ports/user-agent-parse.port";
import { TokenTimeline } from "../../../domain/value-objects/token-timeline.vo";
import { AuthConfigPort } from "../../ports/auth-config.port";
import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import { HasherPort } from "../../ports/hasher.adapter.port";
import { RefreshTokenRepositoryPort } from "../../ports/refresh-token.repository.port";
import { RefreshTokenFamilyRepositoryPort } from "../../ports/refresh-token-family.repository.port";
import { DeviceRepositoryPort } from "../../ports/device.repository.port";

export type LoginWithPasswordInput = {
  email: string;
  password: string;
  device_token?: string;
  ip_address: string;
  user_agent: string;
  device_name?: string;
};

export type LoginWithPasswordOutput = {
  access_token: string;
  refresh_token: string;
  device_token: string;
  token_type: "Bearer";
};

@Injectable()
export class LoginWithPasswordUsecase {
  constructor(
    @Inject(UserProviderPort)
    private readonly userProvider: UserProviderPort,

    @Inject(TokenSignerPort)
    private readonly tokenSigner: TokenSignerPort,
    @Inject(IdGeneratorPort)
    private readonly idGenerator: IdGeneratorPort,
    @Inject(InfoIpAddressPort)
    private readonly infoIpAddress: InfoIpAddressPort,
    @Inject(UserAgentParsePort)
    private readonly userAgentParse: UserAgentParsePort,
    @Inject(AuthConfigPort)
    private readonly authConfig: AuthConfigPort,
    @Inject(HasherPort)
    private readonly hasher: HasherPort,
    @Inject(DeviceRepositoryPort)
    private readonly deviceRepository: DeviceRepositoryPort,
    @Inject(RefreshTokenRepositoryPort)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(RefreshTokenFamilyRepositoryPort)
    private readonly refreshTokenFamilyRepository: RefreshTokenFamilyRepositoryPort,
  ) {}

  public async execute(
    input: LoginWithPasswordInput,
  ): Promise<LoginWithPasswordOutput> {
    const { user_id } = await this.getUser({
      email: input.email,
      password: input.password,
    });

    if (!user_id) {
      throw new Error("Invalid credentials.");
    }

    const { device_id, device_token } = await this.getDevice({
      ip_address: input.ip_address,
      user_agent: input.user_agent,
      user_id,
      device_name: input.device_name,
      device_token: input.device_token,
    });

    if (!device_id) {
      throw new Error(
        "Error occurred at certified the validation of device token.",
      );
    }

    const { refresh_token_family_id, refresh_token_family_round } =
      await this.getRefreshTokenFamily({
        device_id: device_id,
        user_id,
      });

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: user_id,
    });

    const { refresh_token } = await this.getRefreshToken({
      refresh_token_family_id,
      refresh_token_family_round,
      user_id,
    });

    return {
      access_token: accessToken,
      refresh_token: refresh_token,
      device_token: device_token,
      token_type: "Bearer",
    };
  }

  private async getUser(payload: {
    email: string;
    password: string;
  }): Promise<{ user_id: string | undefined }> {
    const user = await this.userProvider.validateCredentials({
      email: payload.email,
      password: payload.password,
    });

    return {
      user_id: user?.id,
    };
  }

  private async getDevice(payload: {
    user_agent: string;
    user_id: string;
    device_name?: string;
    device_token?: string;
    ip_address: string;
  }): Promise<{ device_id: string | null; device_token: string }> {
    const userAgentInfo = this.userAgentParse.parse(payload.user_agent);

    const deviceName = `${userAgentInfo.browser_name} on ${userAgentInfo.os_name} ${userAgentInfo.os_version}`;
    const deviceType = userAgentInfo.device.type ?? DeviceType.DESKTOP;

    const info = await this.infoIpAddress.get(payload.ip_address);

    if (info instanceof Error) {
      throw new Error("Error occurred at get info ip address");
    }

    let deviceToken = payload.device_token;

    if (!deviceToken) {
      const deviceEntity = Device.create(this.idGenerator.generate(), {
        location: DeviceLocation.create(info),
        userAgent: payload.user_agent,
        userId: payload.user_id,
        type: deviceType,
        name: payload.device_name ?? deviceName,
      });

      await this.deviceRepository.save(deviceEntity);

      deviceToken = await this.tokenSigner.signDeviceToken({
        sub: deviceEntity.id,
      });
    }

    const validateToken = await this.tokenSigner.verify<{
      sub: string;
    }>(deviceToken);

    return {
      device_id: validateToken.sub,
      device_token: deviceToken,
    };
  }

  private async getRefreshTokenFamily(payload: {
    device_id: string;
    user_id: string;
  }): Promise<{
    refresh_token_family_id: string;
    refresh_token_family_round: number;
  }> {
    const refreshTokenFamilyId = this.idGenerator.generate();

    const refreshTokenFamilyExpireAtMiliSeconds = new Date(
      Date.now() + this.authConfig.refreshTokenFamilyExpireAtSeconds * 1000,
    );

    const refreshTokenFamilyEntity = RefreshTokenFamily.create(
      refreshTokenFamilyId,
      {
        deviceId: payload.device_id,
        userId: payload.user_id,
        timeline: TokenTimeline.create(refreshTokenFamilyExpireAtMiliSeconds),
      },
    );

    await this.refreshTokenFamilyRepository.save(refreshTokenFamilyEntity);

    return {
      refresh_token_family_id: refreshTokenFamilyEntity.id,
      refresh_token_family_round: refreshTokenFamilyEntity.refreshRound,
    };
  }

  private async getRefreshToken(payload: {
    refresh_token_family_round: number;
    refresh_token_family_id: string;
    user_id: string;
  }): Promise<{ refresh_token: string }> {
    const refreshTokenExpireAtMiliSeconds = new Date(
      Date.now() + this.authConfig.refreshTokenExpireAtSeconds * 1000,
    );

    const refreshTokenId = this.idGenerator.generate();

    const refreshToken = await this.tokenSigner.signRefreshToken({
      sub: refreshTokenId,
      round: payload.refresh_token_family_round,
    });

    const refreshTokenHashed = await this.hasher.hash(refreshToken);

    const refreshTokenEntity = RefreshToken.create(refreshTokenId, {
      previousRefreshTokenId: null,
      refreshRound: payload.refresh_token_family_round,
      refreshTokenFamilyId: payload.refresh_token_family_id,
      replacedByRefreshTokenId: null,
      timeline: TokenTimeline.create(refreshTokenExpireAtMiliSeconds),
      userId: payload.user_id,
      tokenHash: refreshTokenHashed,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      refresh_token: refreshToken,
    };
  }
}
