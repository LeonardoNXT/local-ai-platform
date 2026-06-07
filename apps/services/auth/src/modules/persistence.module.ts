import { SigningKeyRepositoryPort } from "../application/ports/signing-key.repository.port";
import { SigningKeyOrmEntity } from "../infrastructure/persistence/entities/signing-key.orm-entity";
import { TypeormSigningKeyRepository } from "../infrastructure/persistence/repositories/typeorm-signing-key.repository";
import { RefreshTokenRepositoryPort } from "../application/ports/refresh-token.repository.port";
import { TypeormRefreshTokenRepository } from "../infrastructure/persistence/repositories/typeorm-refresh-token.repository";
import { RefreshTokenFamilyRepositoryPort } from "../application/ports/refresh-token-family.repository.port";
import { TypeormRefreshTokenFamilyRepository } from "../infrastructure/persistence/repositories/typeorm-refresh-token-family.repository";
import { DeviceRepositoryPort } from "../application/ports/device.repository.port";
import { TypeormDeviceRepository } from "../infrastructure/persistence/repositories/typeorm-device.repository";
import { RefreshTokenFamilyOrmEntity } from "../infrastructure/persistence/entities/refresh-token-family.orm-entity";
import { RefreshTokenOrmEntity } from "../infrastructure/persistence/entities/refresh-token.orm-entity";
import { DeviceOrmEntity } from "../infrastructure/persistence/entities/device.orm-entity";
import {
  OutboxOrmEntity,
  OutboxPort,
  TypeOrmOutboxRepository,
} from "@local-ai/shared-messenger";
import { Module } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OAuthAcoountsOrmEntity } from "../infrastructure/persistence/entities/oauth-client.orm-entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SigningKeyOrmEntity,
      RefreshTokenFamilyOrmEntity,
      RefreshTokenOrmEntity,
      DeviceOrmEntity,
      OutboxOrmEntity,
      OAuthAcoountsOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: SigningKeyRepositoryPort,
      useClass: TypeormSigningKeyRepository,
    },
    {
      provide: RefreshTokenFamilyRepositoryPort,
      useClass: TypeormRefreshTokenFamilyRepository,
    },
    {
      provide: RefreshTokenRepositoryPort,
      useClass: TypeormRefreshTokenRepository,
    },
    {
      provide: DeviceRepositoryPort,
      useClass: TypeormDeviceRepository,
    },
    {
      provide: OutboxPort,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        return TypeOrmOutboxRepository.create(dataSource);
      },
    },
  ],
  exports: [
    SigningKeyRepositoryPort,
    RefreshTokenFamilyRepositoryPort,
    RefreshTokenRepositoryPort,
    DeviceRepositoryPort,
    OutboxPort,
  ],
})
export class PersistenceModule {}
