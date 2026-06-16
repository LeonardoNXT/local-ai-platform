import { http } from "./http";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  birthday: string;
};

export type OAuthRegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  birthday: string;
  deviceName?: string;
};

export type GetDeviceOutput = {
  name: string;
  location: string;
  lastSeenAt: string;
};

export type OAuthIntentPayload = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
  email_verified: boolean;
};

export abstract class AuthService {
  public static login(payload: LoginPayload) {
    return http<void>("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }
  public static oauthLogin() {
    window.location.href = "/api/oauth/google/login";
  }

  public static register(payload: RegisterInput) {
    return http<void>("/api/users", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }
  public static oauthRegister(payload: OAuthRegisterInput) {
    return http<void>("/api/oauth/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }
  public static getOauthIntent() {
    return http<OAuthIntentPayload>("/api/oauth/oauthintent", {
      credentials: "include",
    });
  }

  public static getDevice() {
    return http<GetDeviceOutput>("/api/auth/device", {
      credentials: "include",
    });
  }
}
