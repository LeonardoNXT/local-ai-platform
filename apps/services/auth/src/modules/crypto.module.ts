import { Module } from "@nestjs/common";

import { JwksExporterPort } from "../application/ports/jwks-exporter.port";
import { SigningKeyGeneratorPort } from "../application/ports/signing-key-generator.port";
import { JoseJwksExporterAdapter } from "../infrastructure/crypto/jose-jwks-exporter.adapter";
import { NodeSigningKeyGeneratorAdapter } from "../infrastructure/crypto/node-signing-key-generator.adapter";

@Module({
  providers: [
    {
      provide: SigningKeyGeneratorPort,
      useClass: NodeSigningKeyGeneratorAdapter,
    },
    {
      provide: JwksExporterPort,
      useClass: JoseJwksExporterAdapter,
    },
  ],
  exports: [SigningKeyGeneratorPort, JwksExporterPort],
})
export class CryptoModule {}
