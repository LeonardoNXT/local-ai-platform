export const authConfig = {
  issuer: process.env.AUTH_ISSUER ?? "http://localhost:3001",
  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900),
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 15),
};
