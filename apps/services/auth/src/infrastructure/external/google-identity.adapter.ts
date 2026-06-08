import { Injectable } from "@nestjs/common";
import {
  GoogleIdentityPayload,
  GoogleIdentityPort,
} from "../../application/ports/google-identity.port";
import { authConfig } from "../config/auth.config";

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  refresh_token?: string;
};

@Injectable()
export class GoogleIdentityAdapter implements GoogleIdentityPort {
  public async token(payload: GoogleIdentityPayload): Promise<string> {
    const body = new URLSearchParams({
      code: payload.code,
      client_id: authConfig.google.clientId,
      client_secret: authConfig.google.clientSecret,
      redirect_uri: authConfig.google.redirectUri,
      grant_type: "authorization_code",
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = (await response.json()) as GoogleTokenResponse;

    if (!response.ok) {
      throw new Error("Error occurred while getting Google OAuth token");
    }

    return data.id_token;
  }
}
