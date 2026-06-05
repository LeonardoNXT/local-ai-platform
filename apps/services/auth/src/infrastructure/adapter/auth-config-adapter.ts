import { Injectable } from "@nestjs/common";
import { type AuthConfigPort } from "../../application/ports/auth-config.port";
import { authConfig } from "../config/auth.config";

@Injectable()
export class AuthConfigAdapter implements AuthConfigPort {
  public get accessTokenExpireAtSeconds(): number {
    return authConfig.accessTokenTtlSeconds;
  }
  public get refreshTokenExpireAtSeconds(): number {
    return authConfig.refreshTokenTtlSeconds;
  }

  public get refreshTokenFamilyExpireAtSeconds(): number {
    return authConfig.refreshTokenFamilySeconds;
  }
}
