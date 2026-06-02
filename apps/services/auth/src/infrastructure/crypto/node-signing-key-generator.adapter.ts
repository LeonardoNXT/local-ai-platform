import { Injectable } from "@nestjs/common";
import { generateKeyPairSync, randomUUID } from "node:crypto";

import { SigningKeyGeneratorPort } from "../../application/ports/signing-key-generator.port";
import { SigningKey } from "../../domain/entities/signing-key.entity";

@Injectable()
export class NodeSigningKeyGeneratorAdapter implements SigningKeyGeneratorPort {
  generate(): SigningKey {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    return SigningKey.create({
      id: randomUUID(),
      kid: randomUUID(),
      algorithm: "RS256",
      publicKeyPem: publicKey,
      privateKeyPem: privateKey,
      active: true,
      createdAt: new Date(),
    });
  }
}
