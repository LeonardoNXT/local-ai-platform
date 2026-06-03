import { NestFactory } from "@nestjs/core/nest-factory";
import { UserHttpModule } from "./http.module";

export class HttpBootstrap {
  public static async start(): Promise<void> {
    const app = await NestFactory.create(UserHttpModule);

    const port = process.env.USER_PORT || 3000;

    await app.listen(port, () => {
      console.log(`HTTP SERVER IS RUNNIG ON PORT : ${port}`);
    });
  }
}
