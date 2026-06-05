import { Module } from "@nestjs/common";
import { AuthController } from "../infrastructure/http/controllers/auth.controller";
import { LoginWithPasswordUsecase } from "../application/usecases/login/login-with-password.usecase";
import { CryptoModule } from "./crypto.module";
import { PersistenceModule } from "./persistence.module";
import { ExternalModule } from "./external.module";
import { AdapterModule } from "./adapter.module";
@Module({
  imports: [CryptoModule, PersistenceModule, ExternalModule, AdapterModule],
  controllers: [AuthController],
  providers: [LoginWithPasswordUsecase],
})
export class AuthModule {}
