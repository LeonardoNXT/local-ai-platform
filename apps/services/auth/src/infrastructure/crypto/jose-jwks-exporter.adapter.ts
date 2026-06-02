import { Injectable } from "@nestjs/common";
import { exportJWK, importSPKI } from "jose";

import {
  JsonWebKeySet,
  JwksExporterPort,
} from "../../application/ports/jwks-exporter.port";
import { SigningKey } from "../../domain/entities/signing-key.entity";

@Injectable()
export class JoseJwksExporterAdapter implements JwksExporterPort {
  async export(signingKey: SigningKey): Promise<JsonWebKeySet> {
    const publicKey = await importSPKI(
      signingKey.publicKeyPem,
      signingKey.algorithm,
    );

    const jwk = await exportJWK(publicKey);

    return {
      keys: [
        {
          ...jwk,
          kid: signingKey.kid,
          alg: signingKey.algorithm,
          use: "sig",
        },
      ],
    };
  }
}
