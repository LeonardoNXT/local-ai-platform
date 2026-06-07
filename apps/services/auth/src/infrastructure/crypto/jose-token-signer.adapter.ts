import { Injectable } from "@nestjs/common";
import {
  createRemoteJWKSet,
  importPKCS8,
  importSPKI,
  jwtVerify,
  SignJWT,
} from "jose";

import {
  AccessTokenPayload,
  DeviceTokenPayload,
  OAuthIntentPayload,
  RefreshTokenPayload,
  TokenSignerPort,
  VerifyOAuthGoogleResponse,
} from "../../application/ports/token-signer.port";
import { SigningKeyRepositoryPort } from "../../application/ports/signing-key.repository.port";
import { authConfig } from "../config/auth.config";
import { SigningKey } from "../../domain/entities/signing-key.entity";

@Injectable()
export class JoseTokenSignerAdapter implements TokenSignerPort {
  constructor(
    private readonly signingKeyRepository: SigningKeyRepositoryPort,
  ) {}

  public async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const { privateKey, signingKey } = await this.privateKey();

    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({
      sub: payload.sub,
    })
      .setProtectedHeader({
        alg: signingKey.algorithm,
        kid: signingKey.kid,
        typ: "JWT",
      })
      .setIssuer(authConfig.issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + authConfig.accessTokenTtlSeconds)
      .sign(privateKey);
  }

  public async signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    const { privateKey, signingKey } = await this.privateKey();
    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({
      sub: payload.sub,
      round: payload.round,
    })
      .setProtectedHeader({
        alg: signingKey.algorithm,
        kid: signingKey.kid,
        typ: "JWT",
      })
      .setIssuer(authConfig.issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + authConfig.refreshTokenTtlSeconds)
      .sign(privateKey);
  }

  public async signDeviceToken(payload: DeviceTokenPayload): Promise<string> {
    const { privateKey, signingKey } = await this.privateKey();

    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({
      sub: payload.sub,
    })
      .setProtectedHeader({
        alg: signingKey.algorithm,
        kid: signingKey.kid,
        typ: "JWT",
      })
      .setIssuer(authConfig.issuer)
      .setIssuedAt(now)
      .sign(privateKey);
  }

  public async validate(token: string): Promise<boolean> {
    try {
      await this.verify<unknown>(token);
      return true;
    } catch {
      return false;
    }
  }

  public async verify<TPayload>(token: string): Promise<TPayload> {
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      throw new Error("No active signing key found.");
    }

    const publicKey = await importSPKI(
      signingKey.publicKeyPem,
      signingKey.algorithm,
    );

    const { payload } = await jwtVerify(token, publicKey, {
      issuer: authConfig.issuer,
    });

    return payload as TPayload;
  }

  public async signOAuthIntent(payload: OAuthIntentPayload): Promise<string> {
    const { privateKey, signingKey } = await this.privateKey();
    const now = Math.floor(Date.now() / 1000);

    return new SignJWT({
      sub: payload.providerAccountId,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      provider: payload.provider,
      email_verified: payload.emailVerified,
    })
      .setProtectedHeader({
        alg: signingKey.algorithm,
        kid: signingKey.kid,
        typ: "JWT",
      })
      .setIssuer(authConfig.issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + authConfig.oauthIntentTtlSeconds)
      .sign(privateKey);
  }

  public async verifyOAuthGoogle(
    token: string,
  ): Promise<VerifyOAuthGoogleResponse> {
    const googleJWKS = createRemoteJWKSet(
      new URL("https://www.googleapis.com/oauth2/v3/certs"),
    );

    const { payload } = await jwtVerify(token, googleJWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return {
      providerAccountId: payload.sub as string,
      email: payload.email as string,
      email_verified: payload.email_verified as boolean,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
    };
  }

  private async privateKey(): Promise<{
    privateKey: CryptoKey;
    signingKey: SigningKey;
  }> {
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      throw new Error("No active signing key found.");
    }

    return {
      privateKey: await importPKCS8(
        signingKey.privateKeyPem,
        signingKey.algorithm,
      ),
      signingKey: signingKey,
    };
  }
}
