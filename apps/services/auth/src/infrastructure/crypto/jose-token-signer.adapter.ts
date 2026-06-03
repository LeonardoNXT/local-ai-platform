import { Injectable } from "@nestjs/common";
import { importPKCS8, SignJWT } from "jose";

import {
  AccessTokenPayload,
  TokenSignerPort,
} from "../../application/ports/token-signer.port";
import { SigningKeyRepositoryPort } from "../../application/ports/signing-key.repository.port";
import { authConfig } from "../config/auth.config";

@Injectable()
export class JoseTokenSignerAdapter implements TokenSignerPort {
  constructor(
    private readonly signingKeyRepository: SigningKeyRepositoryPort,
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
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
}
