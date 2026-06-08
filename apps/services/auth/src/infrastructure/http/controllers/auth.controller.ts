import { Body, Controller, Post, Res } from "@nestjs/common";
import { LoginWithPasswordUsecase } from "../../../application/usecases/login/login-with-password.usecase";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { IpAddress } from "../decorators/ip-address.decorator";
import { UserAgent } from "../decorators/user-agent.decorator";
import { Response } from "express";
import { authConfig } from "../../config/auth.config";

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
    @Res({ passthrough: true }) res: Response,
  ) {
    if (user_agent.length === 0) {
      throw new Error("User-Agent header is required");
    }

    if (ip_address.length === 0) {
      throw new Error("IP address is required");
    }

    const { access_token, device_token, refresh_token } =
      await this.loginWithPasswordUsecase.execute({
        email: body.email,
        password: body.password,
        user_agent,
        ip_address,
      });

    res.cookie("device_token", device_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: authConfig.refreshTokenTtlSeconds * 1000,
    });

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: authConfig.accessTokenTtlSeconds * 1000,
    });
  }
}
