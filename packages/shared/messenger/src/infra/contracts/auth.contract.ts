export type AuthRefreshAcessTokenPayload = {
  userId: string;
  deviceId: string;
  refreshTokenId: string;
  refreshTokenFamilyId: string;
};

export type AuthRotateRefreshToken = {
  userId: string;
  deviceId: string;
  refreshTokenId: string;
  refreshTokenFamilyId: string;
};

export type AuthRevokeRefreshToken = {
  userId: string;
  deviceId: string;
  refreshToken: string;
};

export type AuthRefreshTokenReused = {
  userId: string;
  deviceId: string;
  refreshToken: string;
};
