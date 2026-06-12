import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Res,
} from "@nestjs/common";
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
import { OAuthIntentToken } from "../decorators/oauth-intent.decorator";
import {
  OAuthRegisterInput,
  OAuthRegisterUsecase,
} from "../../../application/usecases/register/register-with-oauth.usecase";
import { OAuthRegisterDto } from "../dtos/register-oauth.dto";
import { OAuthIntentUsecase } from "../../../application/services/oauth-intent.usecase";
import { GoogleOAuthService } from "../../../application/services/google-oauth.service";

@Controller("oauth")
export class OAuthController {
  public constructor(
    private readonly LoginWithGoogleUsecase: LoginWithGoogleUsecase,
    private readonly OAuthRegisterUsecase: OAuthRegisterUsecase,
    private readonly OAuthIntentUsecase: OAuthIntentUsecase,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  @Get("oauthintent")
  public async oauthIntent(@OAuthIntentToken() token: string) {
    const oauthIntentToken = await this.OAuthIntentUsecase.execute({
      oauthIntentToken: token,
    });

    return oauthIntentToken;
  }

  @Get("google/login")
  @Redirect(undefined, 302)
  public getGoogleRouteURL() {
    const state = this.googleOAuthService.createState("login");
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
    if (identity.error) {
      const url = new URL(String(authConfig.frontEndURL) + "/login");

      url.searchParams.set("error", identity.error);
      url.searchParams.set("type", "Google");

      return res.redirect(url.toString());
    }

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

      return res.redirect(String(authConfig.frontEndURL) + "/register?step=2");
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

  @Post("register")
  public async registerWithOAuth(
    @Body() data: OAuthRegisterDto,
    @IpAddress() ipAddress: string,
    @UserAgent() userAgent: string,
    @DeviceToken() deviceToken: string | undefined,
    @OAuthIntentToken() oauthIntentToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const content: OAuthRegisterInput = {
      birthday: data.birthday,
      email: data.email,
      ipAddress: ipAddress,
      name: data.name,
      oauthIntent: oauthIntentToken,
      password: data.password,
      userAgent: userAgent,
      username: data.username,
      deviceToken: deviceToken,
    };

    if (!deviceToken) {
      content.deviceName = data.deviceName;
    }

    const { access_token, device_token, refresh_token, error } =
      await this.OAuthRegisterUsecase.execute(content);

    if (error) {
      throw new HttpException(
        error || "There was error on register client.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    res.cookie("device_token", refresh_token, {
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    });

    res.cookie("refresh_token", device_token, {
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: authConfig.refreshTokenTtlSeconds * 1000,
    });

    res.cookie("access_token", access_token, {
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: authConfig.accessTokenTtlSeconds * 1000,
    });
  }
}
