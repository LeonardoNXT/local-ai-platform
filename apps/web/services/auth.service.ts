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
  public static oauthRegister(payload: RegisterInput) {
    return http<void>("/api/oauth/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }
}
