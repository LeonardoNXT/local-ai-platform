import { Inject } from "@nestjs/common";
import { UserProviderPort } from "../../ports/user-provider.port";
import { SessionFactoryService } from "../../services/session-factory.service";
import { IdGeneratorPort } from "../../ports/id-generator.port";
import { OAuthEntity } from "../../../domain/entities/oauth-client.entity";
import { OAuthRepositoryPort } from "../../ports/oauth-repository.port";
import { TokenSignerPort } from "../../ports/token-signer.port";
import { OAuthIntent } from "../../../domain/types/oauth-intent.types";

export type OAuthRegisterInput = {
  username: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  oauthIntent: string;
  ipAddress: string;
  userAgent: string;
  deviceName?: string;
  deviceToken?: string;
};

export type OAuthRegisterOutput = {
  error?: string;
  refresh_token: string;
  access_token: string;
  device_token: string;
};

export class OAuthRegisterUsecase {
  public constructor(
    @Inject(UserProviderPort) private readonly userService: UserProviderPort,
    @Inject(SessionFactoryService)
    private readonly sessionFactory: SessionFactoryService,
    @Inject(IdGeneratorPort) private readonly idGenerator: IdGeneratorPort,
    @Inject(OAuthRepositoryPort)
    private readonly oauthRepository: OAuthRepositoryPort,
    @Inject(TokenSignerPort) private readonly tokenSigner: TokenSignerPort,
  ) {}

  public async execute(
    input: OAuthRegisterInput,
  ): Promise<OAuthRegisterOutput> {
    const oauthIntent = await this.tokenSigner.verify<OAuthIntent>(
      input.oauthIntent,
    );

    const userService = await this.userService.register({
      birthday: input.birthday,
      email: input.email,
      isEmailVerified: oauthIntent.email_verified,
      name: input.name,
      password: input.password,
      username: input.username,
    });

    const { accessToken, deviceToken, refreshToken } =
      await this.sessionFactory.create({
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        userId: userService.id,
        deviceName: input.deviceName,
        deviceToken: input.deviceToken,
      });

    const oauthSync = OAuthEntity.create(this.idGenerator.generate(), {
      provider: "Google",
      providerAccountId: oauthIntent.sub,
      userId: userService.id,
    });

    await this.oauthRepository.save(oauthSync);

    return {
      access_token: accessToken,
      device_token: deviceToken,
      refresh_token: refreshToken,
    };
  }
}
