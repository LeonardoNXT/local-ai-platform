import { DynamicModule, Module } from "@nestjs/common";
import { UserController } from "../controllers/user.controller";
import { UseCases } from "../../../others/initializer/usecases";
import { USER_USECASES } from "./tokens";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "../errors/global-exception.filter";

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
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    };
  }
}
