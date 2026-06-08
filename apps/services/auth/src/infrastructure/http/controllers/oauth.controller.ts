import { Controller, Get, Redirect, Res } from "@nestjs/common";
import { authConfig, OAuthUrls } from "../../config/auth.config";
import { LoginWithGoogleUsecase } from "../../../application/usecases/login/login-with-google.usecase";
import {
  GoogleIdentity,
  GoogleIdentityPayload,
} from "../decorators/google-identity.decorator";
import { DeviceToken } from "../decorators/device-token.decorator";
import { IpAddress } from "../decorators/ip-address.decorator";
import { UserAgent } from "../decorators/user-agent.decorator";
import { Response } from "express";

@Controller("oauth")
export class OAuthController {
  public constructor(
    private readonly LoginWithGoogleUsecase: LoginWithGoogleUsecase,
  ) {}

  @Get("google/login")
  @Redirect(undefined, 302)
  public getGoogleRouteURL() {
    return {
      url: OAuthUrls.google.auth(),
    };
  }
  @Get("google/callback")
  public async getGoogleCallback(
    @GoogleIdentity() identity: GoogleIdentityPayload,
    @DeviceToken() device_token: string | undefined,
    @IpAddress() ip_address: string,
    @UserAgent() user_agent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log({
      log: "DEBUG",
      exists: Boolean(device_token),
      content: device_token,
    });

    const { oauthIntent, accessToken, deviceToken, refreshToken } =
      await this.LoginWithGoogleUsecase.execute({
        code: identity.code,
        ip_address: ip_address,
        state: identity.state,
        user_agent: user_agent,
        device_token: device_token,
        scope: identity.scope,
      });

    if (oauthIntent) {
      res.cookie("oauth_intent", oauthIntent, {
        secure: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: authConfig.oauthIntentTtlSeconds * 1000,
      });

      return res.redirect(String(authConfig.frontEndURL) + "/register");
    } else {
      res.cookie("device_token", deviceToken, {
        secure: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      });

      res.cookie("refresh_token", refreshToken, {
        secure: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: authConfig.refreshTokenTtlSeconds * 1000,
      });

      res.cookie("access_token", accessToken, {
        secure: true,
        sameSite: "lax",
        httpOnly: true,
        maxAge: authConfig.accessTokenTtlSeconds * 1000,
      });
    }

    res.redirect(String(authConfig.frontEndURL));
  }
}
