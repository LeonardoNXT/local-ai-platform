import { AppDataSource } from "../infra/database/data-source";
import { HttpBootstrap } from "../infra/http/nest/http.bootstrap";
import { RepositoriesInitializer } from "./initializer/repositories";
import { ServicesInitializer } from "./initializer/services";
import { UseCasesInitializer } from "./initializer/usecases";
import { ExternalInitializer } from "./initializer/external";

export async function bootstrap() {
  await AppDataSource.initialize();

  const repositories = RepositoriesInitializer.all({
    dataSource: AppDataSource,
  });

  const services = ServicesInitializer.all();

  const usecases = UseCasesInitializer.all({
    userRepository: repositories.userRepository,
    passwordHasher: services.passwordHasher,
  });

  const external = await ExternalInitializer.all({
    usecases,
    outboxRepository: repositories.outboxRepository,
  });

  external.grpc.start();

  await HttpBootstrap.start({
    usecases,
  });

  await external.outboxWorker.start();
}
