import { Inject, Injectable } from "@nestjs/common";
import { IdGeneratorPort } from "../ports/id-generator.port";
import { InfoIpAddressPort } from "../ports/info-ip-address.port";
import { UserAgentParsePort } from "../ports/user-agent-parse.port";
import { AuthConfigPort } from "../ports/auth-config.port";
import { TokenSignerPort } from "../ports/token-signer.port";
import { HasherPort } from "../ports/hasher.adapter.port";
import { DeviceRepositoryPort } from "../ports/device.repository.port";
import { RefreshTokenRepositoryPort } from "../ports/refresh-token.repository.port";
import { RefreshTokenFamilyRepositoryPort } from "../ports/refresh-token-family.repository.port";
import { Device, DeviceType } from "../../domain/entities/device.entity";
import { DeviceLocation } from "../../domain/value-objects/device-location.vo";
import { TokenTimeline } from "../../domain/value-objects/token-timeline.vo";
import { RefreshTokenFamily } from "../../domain/entities/refresh-token-family.entity";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";

export type CreateSessionInput = {
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceToken?: string;
  deviceName?: string;
};

export type CreateSessionOutput = {
  accessToken: string;
  refreshToken: string;
  deviceToken: string;
  tokenType: "Bearer";
};

@Injectable()
export class SessionFactoryService {
  public constructor(
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

  public async create(input: CreateSessionInput): Promise<CreateSessionOutput> {
    const { deviceId, deviceToken } = await this.getDevice({
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      deviceName: input.deviceName,
      deviceToken: input.deviceToken,
    });

    const { refreshTokenFamilyId, refreshTokenFamilyRound } =
      await this.getRefreshTokenFamily({
        deviceId,
        userId: input.userId,
      });

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: input.userId,
    });

    const { refreshToken } = await this.getRefreshToken({
      userId: input.userId,
      refreshTokenFamilyId,
      refreshTokenFamilyRound,
    });

    return {
      accessToken,
      refreshToken,
      deviceToken,
      tokenType: "Bearer",
    };
  }

  private async getDevice(input: {
    userAgent: string;
    deviceName?: string;
    deviceToken?: string;
    ipAddress: string;
  }): Promise<{ deviceId: string; deviceToken: string }> {
    const userAgentInfo = this.userAgentParse.parse(input.userAgent);

    const deviceName = `${userAgentInfo.browser_name} on ${userAgentInfo.os_name} ${userAgentInfo.os_version}`;
    const deviceType = userAgentInfo.device.type ?? DeviceType.DESKTOP;

    const info = await this.infoIpAddress.get(input.ipAddress);

    if (info instanceof Error) {
      throw new Error("Error occurred at get info ip address");
    }

    let deviceToken = input.deviceToken;

    if (!deviceToken) {
      const deviceEntity = Device.create(this.idGenerator.generate(), {
        location: DeviceLocation.create(info),
        userAgent: input.userAgent,
        type: deviceType,
        name: input.deviceName ?? deviceName,
      });

      await this.deviceRepository.save(deviceEntity);

      deviceToken = await this.tokenSigner.signDeviceToken({
        sub: deviceEntity.id,
      });
    }

    const validatedToken = await this.tokenSigner.verify<{ sub: string }>(
      deviceToken,
    );

    return {
      deviceId: validatedToken.sub,
      deviceToken,
    };
  }

  private async getRefreshTokenFamily(input: {
    deviceId: string;
    userId: string;
  }): Promise<{
    refreshTokenFamilyId: string;
    refreshTokenFamilyRound: number;
  }> {
    const refreshTokenFamilyId = this.idGenerator.generate();

    const expiresAt = new Date(
      Date.now() + this.authConfig.refreshTokenFamilyExpireAtSeconds * 1000,
    );

    const entity = RefreshTokenFamily.create(refreshTokenFamilyId, {
      deviceId: input.deviceId,
      userId: input.userId,
      timeline: TokenTimeline.create(expiresAt),
    });

    await this.refreshTokenFamilyRepository.save(entity);

    return {
      refreshTokenFamilyId: entity.id,
      refreshTokenFamilyRound: entity.refreshRound,
    };
  }

  private async getRefreshToken(input: {
    refreshTokenFamilyRound: number;
    refreshTokenFamilyId: string;
    userId: string;
  }): Promise<{ refreshToken: string }> {
    const expiresAt = new Date(
      Date.now() + this.authConfig.refreshTokenExpireAtSeconds * 1000,
    );

    const refreshTokenId = this.idGenerator.generate();

    const refreshToken = await this.tokenSigner.signRefreshToken({
      sub: refreshTokenId,
      round: input.refreshTokenFamilyRound,
    });

    const tokenHash = await this.hasher.hash(refreshToken);

    const entity = RefreshToken.create(refreshTokenId, {
      previousRefreshTokenId: null,
      refreshRound: input.refreshTokenFamilyRound,
      refreshTokenFamilyId: input.refreshTokenFamilyId,
      replacedByRefreshTokenId: null,
      timeline: TokenTimeline.create(expiresAt),
      userId: input.userId,
      tokenHash,
    });

    await this.refreshTokenRepository.save(entity);

    return {
      refreshToken,
    };
  }
}
