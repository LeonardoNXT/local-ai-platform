import { DynamicModule, Module } from "@nestjs/common";

@Module({})
export class AppModule {
  public static create(): DynamicModule {
    return {
      module: AppModule,
    };
  }
}
