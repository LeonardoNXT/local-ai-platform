export enum AuthTopics {
  CREATE = "auth.created",
  ROTATE = "auth.rotated",
  REVOKED = "auth.revoked",
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
