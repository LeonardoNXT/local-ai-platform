import { Module } from "@nestjs/common";
import { JwksController } from "../infrastructure/http/controllers/jwks.controller";
import { EnsureSigningKeyUsecase } from "../application/usecases/discovery/ensure-signing-key.usecase";
import { GetJwksUsecase } from "../application/usecases/discovery/get-jwks.usecase";
import { PersistenceModule } from "./persistence.module";
import { CryptoModule } from "./crypto.module";
import { GetOpenidConfigurationUsecase } from "../application/usecases/discovery/get-openid-configuration.usecase";

@Module({
  imports: [PersistenceModule, CryptoModule],
  controllers: [JwksController],
  providers: [
    GetJwksUsecase,
    GetOpenidConfigurationUsecase,
    EnsureSigningKeyUsecase,
  ],
  exports: [EnsureSigningKeyUsecase],
})
export class OidcModule {}
