import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!process.env.AUTH_PORT) return;

  const port = process.env.AUTH_PORT;

  await app.listen(port);

  console.log(`Auth Service running on port ${port}`);
}

void bootstrap();
