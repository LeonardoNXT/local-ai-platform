export type AccessTokenPayload = {
  sub: string;
};

export abstract class TokenSignerPort {
  abstract signAccessToken(payload: AccessTokenPayload): Promise<string>;
}
