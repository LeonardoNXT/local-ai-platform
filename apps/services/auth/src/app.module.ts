import { DynamicModule, Module } from "@nestjs/common";
import { HealthCheckController } from "./infrastructure/http/controllers/life-cycle.controller";
import { OidcModule } from "./modules/oidc.module";
import { PersistenceModule } from "./modules/persistence.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SigningKeyOrmEntity } from "./infrastructure/persistence/entities/signing-key.orm-entity";
import { CryptoModule } from "./modules/crypto.module";
import { AuthModule } from "./modules/auth.module";
import { RefreshTokenFamilyOrmEntity } from "./infrastructure/persistence/entities/refresh-token-family.orm-entity";
import { RefreshTokenOrmEntity } from "./infrastructure/persistence/entities/refresh-token.orm-entity";
import { DeviceOrmEntity } from "./infrastructure/persistence/entities/device.orm-entity";
import {
  MessagePublisherContract,
  OutboxOrmEntity,
} from "@local-ai/shared-messenger";
import { AppBootstrapModule } from "./modules/app-bootstrap.module";
import { MessengerModule } from "./modules/messenger.module";
import { OAuthAcoountsOrmEntity } from "./infrastructure/persistence/entities/oauth-client.orm-entity";

@Module({})
export class AppModule {
  public static create(
    messagePublisher: MessagePublisherContract,
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DATABASE_HOST ?? "localhost",
          port: Number(process.env.DATABASE_PORT ?? 5432),
          username: process.env.DATABASE_USER ?? "admin",
          password: process.env.DATABASE_PASSWORD ?? "admin",
          database: process.env.DATABASE_NAME ?? "local_ai",
          entities: [
            SigningKeyOrmEntity,
            RefreshTokenFamilyOrmEntity,
            RefreshTokenOrmEntity,
            OAuthAcoountsOrmEntity,
            DeviceOrmEntity,
            OutboxOrmEntity,
          ],
          synchronize: true,
        }),
        OidcModule,
        CryptoModule,
        AuthModule,
        PersistenceModule,
        MessengerModule.create(messagePublisher),
        AppBootstrapModule.create(messagePublisher),
      ],
      controllers: [HealthCheckController],
    };
  }
}
