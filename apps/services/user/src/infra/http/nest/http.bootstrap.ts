import { NestFactory } from "@nestjs/core/";
import { UserHttpModule } from "./http.module";
import { type UseCases } from "../../../others/initializer/usecases";
import { ValidationPipe } from "@nestjs/common";

type StartProps = {
  usecases: UseCases;
};

export class HttpBootstrap {
  public static async start({ usecases }: StartProps): Promise<void> {
    const app = await NestFactory.create(
      UserHttpModule.register({
        usecases: usecases,
      }),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = process.env.USER_PORT || 3000;

    await app.listen(port, () => {
      console.log(`HTTP SERVER IS RUNNIG ON PORT : ${port}`);
    });
  }
}
