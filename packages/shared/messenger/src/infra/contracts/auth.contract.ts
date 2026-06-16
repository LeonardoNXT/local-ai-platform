export enum AuthTopics {
  CREATE = "auth.created",
  ROTATE = "auth.rotated",
  REVOKED = "auth.revoked",
  OAUTH_CONNECT = "auth.oauth.connected",
  OAUTH_REMOVE = "auth.oauth.removed",
  OAUTH_LOGIN = "auth.oauth.login",
}

export type AuthRotateRefreshToken = {
  userId: string;
  refreshTokenId: string;
};

export type AuthRevokeRefreshToken = {
  userId: string;
  refreshToken: string;
};

export type AuthRefreshTokenReused = {
  userId: string;
  refreshToken: string;
};
