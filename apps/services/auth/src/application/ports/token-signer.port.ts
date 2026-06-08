export type AccessTokenPayload = {
  sub: string;
};

export type RefreshTokenPayload = {
  sub: string;
  round: number;
};

export type DeviceTokenPayload = {
  sub: string;
};

export type OAuthIntentPayload = {
  name: string | undefined;
  email: string;
  picture: string | undefined;
  providerAccountId: string; // provider_account_id
  provider: string;
  emailVerified: boolean;
};

export type VerifyOAuthGoogleResponse = {
  email: string;
  name?: string;
  picture?: string;
  providerAccountId: string;
  email_verified: boolean;
};

export abstract class TokenSignerPort {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;

  abstract signRefreshToken(payload: RefreshTokenPayload): Promise<string>;

  abstract signDeviceToken(payload: DeviceTokenPayload): Promise<string>;

  abstract signOAuthIntent(payload: OAuthIntentPayload): Promise<string>;

  abstract validate(token: string): Promise<boolean>;

  abstract verify<TPayload>(token: string): Promise<TPayload>;

  abstract verifyOAuthGoogle(token: string): Promise<VerifyOAuthGoogleResponse>;
}
