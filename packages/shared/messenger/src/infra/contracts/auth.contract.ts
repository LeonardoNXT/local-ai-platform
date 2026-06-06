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
