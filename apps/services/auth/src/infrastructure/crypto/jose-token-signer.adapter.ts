import { Injectable } from "@nestjs/common";
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";

import {
  AccessTokenPayload,
  DeviceTokenPayload,
  RefreshTokenPayload,
  TokenSignerPort,
} from "../../application/ports/token-signer.port";
import { SigningKeyRepositoryPort } from "../../application/ports/signing-key.repository.port";
import { authConfig } from "../config/auth.config";

@Injectable()
export class JoseTokenSignerAdapter implements TokenSignerPort {
  constructor(
    private readonly signingKeyRepository: SigningKeyRepositoryPort,
  ) {}

  public async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      throw new Error("No active signing key found.");
    }

    const privateKey = await importPKCS8(
      signingKey.privateKeyPem,
      signingKey.algorithm,
    );

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
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      throw new Error("No active signing key found.");
    }

    const privateKey = await importPKCS8(
      signingKey.privateKeyPem,
      signingKey.algorithm,
    );

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
    const signingKey = await this.signingKeyRepository.findActive();

    if (!signingKey) {
      throw new Error("No active signing key found.");
    }

    const privateKey = await importPKCS8(
      signingKey.privateKeyPem,
      signingKey.algorithm,
    );

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
}
