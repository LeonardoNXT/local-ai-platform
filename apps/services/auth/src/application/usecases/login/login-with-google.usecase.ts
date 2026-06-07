import { Inject, Injectable } from "@nestjs/common";
import { TokenSignerPort } from "../../ports/token-signer.port";
import { OAuthRepositoryPort } from "../../ports/oauth-repository.port";
import { GoogleIdentityPort } from "../../ports/google-identity.port";

type ExecuteInput = {
  code: string;
  scope?: string;
  state: string;
  device_token?: string;
};
type ExecuteOutput =
  | {
      refreshToken: string;
      sccessToken: string;
      deviceToken: string;
    }
  | {
      oauthIntent: string;
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
    @i
  ) {}

  public async execute(input: ExecuteInput): Promise<ExecuteOutput> {
    const googleToken = await this.identity.Token({
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
        oauthIntent: oauthIntent,
      };

      
    }
  }
}
