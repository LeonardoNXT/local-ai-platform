import { Injectable } from "@nestjs/common";
import { GoogleIdentityPayload } from "../../application/ports/google-identity.port";
import { authConfig } from "../config/auth.config";

export type AuthTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token: string;
};

@Injectable()
export class GoogleIndentityAdapter {
  public async getToken(
    payload: GoogleIdentityPayload,
  ): Promise<string | undefined> {
    const body = new URLSearchParams({
      code: payload.code,
      client_id: authConfig.google.clientId,
      client_secret: authConfig.google.clientSecret,
      redirect_uri: authConfig.google.redirectUri,
      grant_type: "authorization_code",
    });

    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = (await response.json()) as AuthTokenResponse;

      return data.id_token;
    } catch (err) {
      new Error(
        err instanceof Error
          ? err.message
          : "Error Ocurrated on get OAuth Google Token",
      );
    }
  }
}
