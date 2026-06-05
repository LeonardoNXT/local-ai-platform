import { Module } from "@nestjs/common";
import { NodeSigningKeyGeneratorAdapter } from "../infrastructure/crypto/node-signing-key-generator.adapter";
import { JoseJwksExporterAdapter } from "../infrastructure/crypto/jose-jwks-exporter.adapter";
import { JoseTokenSignerAdapter } from "../infrastructure/crypto/jose-token-signer.adapter";
import { SigningKeyGeneratorPort } from "../application/ports/signing-key-generator.port";
import { JwksExporterPort } from "../application/ports/jwks-exporter.port";
import { TokenSignerPort } from "../application/ports/token-signer.port";
import { PersistenceModule } from "./persistence.module";
import { HasherPort } from "../application/ports/hasher.adapter.port";
import { Argon2HasherAdapter } from "../infrastructure/crypto/argon2.hasher.adpter";
import { IdGeneratorPort } from "../application/ports/id-generator.port";
import { NodeRandomTokenAdpater } from "../infrastructure/crypto/node-random-token.adapter";

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
    {
      provide: HasherPort,
      useClass: Argon2HasherAdapter,
    },
    {
      provide: IdGeneratorPort,
      useClass: NodeRandomTokenAdpater,
    },
  ],
  exports: [
    SigningKeyGeneratorPort,
    JwksExporterPort,
    TokenSignerPort,
    HasherPort,
    IdGeneratorPort,
  ],
})
export class CryptoModule {}
