import { Module } from "@nestjs/common";
import { SessionFactoryService } from "../application/services/session-factory.service";
import { LoginWithGoogleUsecase } from "../application/usecases/login/login-with-google.usecase";
import { OAuthController } from "../infrastructure/http/controllers/oauth.controller";
import { AdapterModule } from "./adapter.module";
import { CryptoModule } from "./crypto.module";
import { ExternalModule } from "./external.module";
import { PersistenceModule } from "./persistence.module";
import { GoogleIdentityPort } from "../application/ports/google-identity.port";
import { GoogleIdentityAdapter } from "../infrastructure/external/google-identity.adapter";

@Module({
  imports: [CryptoModule, PersistenceModule, ExternalModule, AdapterModule],
  controllers: [OAuthController],
  providers: [
    {
      provide: GoogleIdentityPort,
      useClass: GoogleIdentityAdapter,
    },
    SessionFactoryService,
    LoginWithGoogleUsecase,
  ],
})
export class OAuthModule {}
