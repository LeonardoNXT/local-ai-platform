import { Module } from "@nestjs/common";
import { NodeSigningKeyGeneratorAdapter } from "../infrastructure/crypto/node-signing-key-generator.adapter";
import { JoseJwksExporterAdapter } from "../infrastructure/crypto/jose-jwks-exporter.adapter";
import { JoseTokenSignerAdapter } from "../infrastructure/crypto/jose-token-signer.adapter";
import { SigningKeyGeneratorPort } from "../application/ports/signing-key-generator.port";
import { JwksExporterPort } from "../application/ports/jwks-exporter.port";
import { TokenSignerPort } from "../application/ports/token-signer.port";
import { PersistenceModule } from "./persistence.module";

@Module({
  imports: [PersistenceModule],
  providers: [
    NodeSigningKeyGeneratorAdapter,
    JoseJwksExporterAdapter,
    JoseTokenSignerAdapter,
    {
      provide: SigningKeyGeneratorPort,
      useClass: NodeSigningKeyGeneratorAdapter,
    },
    {
      provide: JwksExporterPort,
      useClass: JoseJwksExporterAdapter,
    },
    {
      provide: TokenSignerPort,
      useClass: JoseTokenSignerAdapter,
    },
  ],
  exports: [SigningKeyGeneratorPort, JwksExporterPort, TokenSignerPort],
})
export class CryptoModule {}
