export const authConfig = {
  port: Number(process.env.AUTH_PORT ?? 3002),

  issuer: process.env.AUTH_ISSUER ?? "http://localhost:8000",

  accessTokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900),

  refreshTokenTtlSeconds:
    Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 15) * 24 * 60 * 60,

  refreshTokenFamilySeconds:
    Number(process.env.REFRESH_TOKEN_FAMILY_TTL_DAYS ?? 90) * 24 * 60 * 60,

  oauthIntentTtlSeconds: Number(process.env.OAUTH_INTENT_TTL_SECONDS ?? 600),

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ??
      "http://localhost:8000/auth/oauth/google/callback",
  },

  database: {
    host: process.env.DATABASE_HOST ?? "postgres",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER ?? "admin",
    password: process.env.DATABASE_PASSWORD ?? "admin",
    name: process.env.DATABASE_NAME ?? "local_ai_auth",
  },

  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(",") ?? ["kafka:9092"],
    clientId: process.env.KAFKA_CLIENT_ID ?? "auth-service",
    groupId: process.env.KAFKA_GROUP_ID ?? "auth-service",
  },

  grpc: {
    userServiceUrl: process.env.USER_GRPC_URL ?? "user-service:50051",
  },

  mock: {
    publicIp: process.env.MOCK_PUBLIC_IP ?? "45.181.33.153",
  },
};
