import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../presentation/nest/modules/app.module.ts";
export default async function bootstrap() {
  const app = await NestFactory.create(AppModule.create());

  await app.listen(process.env.PORT ?? 3002);
}
