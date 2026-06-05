import { Body, Controller, Post } from "@nestjs/common";
import { LoginWithPasswordUsecase } from "../../../application/usecases/login/login-with-password.usecase";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { IpAddress } from "../decorators/ip-address.decorator";
import { UserAgent } from "../decorators/user-agent.decorator";

@Controller()
export class AuthController {
  constructor(
    private readonly loginWithPasswordUsecase: LoginWithPasswordUsecase,
  ) {}

  @Post("login")
  async login(
    @IpAddress() ip_address: string,
    @UserAgent() user_agent: string,
    @Body() body: LoginRequestDto,
  ) {
    if (user_agent.length === 0) {
      throw new Error("User-Agent header is required");
    }

    if (ip_address.length === 0) {
      throw new Error("IP address is required");
    }

    return this.loginWithPasswordUsecase.execute({
      email: body.email,
      password: body.password,
      user_agent,
      ip_address,
    });
  }
}
