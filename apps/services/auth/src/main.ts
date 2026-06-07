import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { KafkaInitializer, MessagePublisher } from "@local-ai/shared-messenger";
import { AuthTopics } from "@local-ai/shared-messenger/dist/src/infra/contracts/auth.contract";

async function bootstrap() {
  const kafka = KafkaInitializer.create(
    {
      brokers: [process.env.KAFKA_BROKERS ?? "localhost:9092"],
    },
    "auth-service",
  );

  await kafka.producerInitializer();

  await kafka.admin([AuthTopics.CREATE, AuthTopics.REVOKED, AuthTopics.ROTATE]);

  const messagePublisher = MessagePublisher.create(kafka);

  const app = await NestFactory.create(AppModule.create(messagePublisher));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!process.env.AUTH_PORT) return;

  const port = process.env.AUTH_PORT;

  await app.listen(port);

  console.log(`Auth Service running on port ${port}`);
}

void bootstrap();
