import { Inject, Injectable } from "@nestjs/common";
import { UserProviderPort } from "../../ports/user-provider.port";
import { SessionFactoryService } from "../../services/session-factory.service";

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
    private readonly sessionFactory: SessionFactoryService,
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

    const session = await this.sessionFactory.create({
      userId: user_id,
      ipAddress: input.ip_address,
      userAgent: input.user_agent,
      deviceName: input.device_name,
      deviceToken: input.device_token,
    });

    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      device_token: session.deviceToken,
      token_type: session.tokenType,
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
}
