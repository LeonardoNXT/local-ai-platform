import { DynamicModule, Module } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UseCases } from "../../../others/initializer/usecases";
import { USER_USECASES } from "./tokens";

type UserHttpModuleProps = {
  usecases: UseCases;
};

@Module({})
export class UserHttpModule {
  static register({ usecases }: UserHttpModuleProps): DynamicModule {
    return {
      module: UserHttpModule,
      controllers: [UserController],
      providers: [
        {
          provide: USER_USECASES,
          useValue: usecases,
        },
      ],
    };
  }
}
