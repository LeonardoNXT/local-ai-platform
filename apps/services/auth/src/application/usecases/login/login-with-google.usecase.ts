import { Inject, Injectable } from "@nestjs/common";
import { TokenSignerPort } from "../../ports/token-signer.port";
import { OAuthRepositoryPort } from "../../ports/oauth-repository.port";
import { GoogleIdentityPort } from "../../ports/google-identity.port";
import { SessionFactoryService } from "../../services/session-factory.service";

type ExecuteInput = {
  code: string;
  scope?: string;
  state: string;
  ip_address: string;
  user_agent: string;
  device_token?: string;
  device_name?: string;
};

export type LoginWithGoogleExecuteOutput = {
  refreshToken?: string;
  accessToken?: string;
  deviceToken?: string;
  oauthIntent?: string;
};

@Injectable()
export class LoginWithGoogleUsecase {
  public constructor(
    @Inject(TokenSignerPort)
    private readonly tokenSigner: TokenSignerPort,

    @Inject(OAuthRepositoryPort)
    private readonly repository: OAuthRepositoryPort,

    @Inject(GoogleIdentityPort)
    private readonly identity: GoogleIdentityPort,

    private readonly sessionFactory: SessionFactoryService,
  ) {}

  public async execute(
    input: ExecuteInput,
  ): Promise<LoginWithGoogleExecuteOutput> {
    const googleToken = await this.identity.token({
      code: input.code,
      state: input.state,
    });

    const decodedToken = await this.tokenSigner.verifyOAuthGoogle(googleToken);

    const oauthEntity = await this.repository.findByProviderAccountId({
      providerAccountId: decodedToken.providerAccountId,
    });

    if (!oauthEntity) {
      const oauthIntent = await this.tokenSigner.signOAuthIntent({
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture,
        provider: "google",
        providerAccountId: decodedToken.providerAccountId,
      });

      return {
        oauthIntent,
      };
    }

    const session = await this.sessionFactory.create({
      userId: oauthEntity.getUserId,
      ipAddress: input.ip_address,
      userAgent: input.user_agent,
      deviceName: input.device_name,
      deviceToken: input.device_token,
    });

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      deviceToken: session.deviceToken,
    };
  }
}
