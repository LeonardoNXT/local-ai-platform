export const authConfig = {
  issuer: process.env.AUTH_ISSUER ?? "http://localhost:3001",
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900),
  refreshTokenTtlSeconds:
    Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 15) * 24 * 60 * 60,
  refreshTokenFamilySeconds:
    Number(process.env.REFRESH_TOKEN_FAMILY_TTL_DAYS ?? 90) * 24 * 60 * 60,
};
