import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SigningKeyRepositoryPort } from "../application/ports/signing-key.repository.port";
import { SigningKeyOrmEntity } from "../infrastructure/persistence/entities/signing-key.orm-entity";
import { TypeormSigningKeyRepository } from "../infrastructure/persistence/repositories/typeorm-signing-key.repository";

@Module({
  imports: [TypeOrmModule.forFeature([SigningKeyOrmEntity])],
  providers: [
    {
      provide: SigningKeyRepositoryPort,
      useClass: TypeormSigningKeyRepository,
    },
  ],
  exports: [SigningKeyRepositoryPort],
})
export class PersistenceModule {}
