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

export abstract class TokenSignerPort {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;

  abstract signRefreshToken(payload: RefreshTokenPayload): Promise<string>;

  abstract signDeviceToken(payload: DeviceTokenPayload): Promise<string>;

  abstract validate(token: string): Promise<boolean>;

  abstract verify<TPayload>(token: string): Promise<TPayload>;
}
