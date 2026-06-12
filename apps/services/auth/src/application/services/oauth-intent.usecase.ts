import { Inject, Injectable } from "@nestjs/common";
import { TokenSignerPort } from "../ports/token-signer.port";

type ExecuteInput = {
  oauthIntentToken: string;
};

type TokenSignerPayload = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
  email_verified: boolean;
};

@Injectable()
export class OAuthIntentUsecase {
  public constructor(
    @Inject(TokenSignerPort) private readonly tokensigner: TokenSignerPort,
  ) {}

  public async execute(input: ExecuteInput) {
    const token = await this.tokensigner.verify<TokenSignerPayload>(
      input.oauthIntentToken,
    );

    return token;
  }
}
