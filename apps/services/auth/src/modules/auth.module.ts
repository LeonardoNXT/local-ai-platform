import { Module } from "@nestjs/common";
import { AuthController } from "../infrastructure/http/controllers/auth.controller";
import { LoginWithPasswordUsecase } from "../application/usecases/login/login-with-password.usecase";
import { UserProviderPort } from "../application/ports/user-provider.port";
import { CryptoModule } from "./crypto.module";
import { PersistenceModule } from "./persistence.module";
import { UserServiceAdapter } from "../infrastructure/external/user-service.adapter";

@Module({
  imports: [CryptoModule, PersistenceModule],
  controllers: [AuthController],
  providers: [
    LoginWithPasswordUsecase,
    {
      provide: UserProviderPort,
      useClass: UserServiceAdapter,
    },
  ],
})
export class AuthModule {}
