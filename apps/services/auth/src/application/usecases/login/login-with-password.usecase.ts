import { Inject, Injectable } from "@nestjs/common";
import { UserProviderPort } from "../../ports/user-provider.port";
import { TokenSignerPort } from "../../ports/token-signer.port";

export type LoginWithPasswordInput = {
  email: string;
  password: string;
};

export type LoginWithPasswordOutput = {
  access_token: string;
  token_type: "Bearer";
};

@Injectable()
export class LoginWithPasswordUsecase {
  constructor(
    @Inject(UserProviderPort)
    private readonly userProvider: UserProviderPort,

    @Inject(TokenSignerPort)
    private readonly tokenSigner: TokenSignerPort,
  ) {}

  async execute(
    input: LoginWithPasswordInput,
  ): Promise<LoginWithPasswordOutput> {
    const user = await this.userProvider.validateCredentials({
      email: input.email,
      password: input.password,
    });

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    const accessToken = await this.tokenSigner.signAccessToken({
      sub: user.id,
    });

    return {
      access_token: accessToken,
      token_type: "Bearer",
    };
  }
}
