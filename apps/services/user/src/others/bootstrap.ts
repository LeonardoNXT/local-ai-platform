import { AppDataSource } from "../infra/database/data-source";
import { TypeOrmUserRepository } from "../infra/repositories/typeorm-user.repository";
import { UserOrmEntity } from "../infra/database/entities/user.orm-entity";
import { Argon2PasswordHasher } from "../infra/cryptography/argon2-password-hasher";
import { GrpcServer } from "../infra/server/grpc/server.grpc";
import { CreateUserUseCase } from "../application/usecases/create-user/create-user.usecase";
import { LoginUserUseCase } from "../application/usecases/login-user/login-user.usecase";
import { grpcUnaryAdapter } from "../infra/server/grpc/adapters/unary-adapter";
import { CreateUserHandler } from "../infra/server/grpc/adapters/user/create-user-handler.adapter";
import { loginUserHandler } from "../infra/server/grpc/adapters/user/login-user-handler.adapter";
import { DeactivateUserUsecase } from "../application/usecases/status/deactivate-user/deactivate-user.usecase";
import { deactivateUserHandler } from "../infra/server/grpc/adapters/user/deactivate-user-handler.adapter";
import { banUserHandler } from "../infra/server/grpc/adapters/user/ban-user-handler.adapter";
import { BanUserUsecase } from "../application/usecases/status/ban-user/ban-user.usecase";
import { suspendUserHandler } from "../infra/server/grpc/adapters/user/suspended-user-handler.adapter";
import { SuspendUserUsecase } from "../application/usecases/status/suspend-user/suspend.usecase.dto";
import { ReactivateUserUsecase } from "../application/usecases/status/reactivate-user/reactivate-user.usecase";
import { ReactivateUserHandler } from "../infra/server/grpc/adapters/user/reactivate-user-handler.adapter";
import { ServiceHandler } from "../infra/server/grpc/services/service-handler.grpc";
import { KafkaInitializer } from "@local-ai/shared-messenger";
import { MessagePublisher } from "@local-ai/shared-messenger";
import { OutboxWorker } from "@local-ai/shared-messenger";
import { TypeOrmOutboxRepository } from "@local-ai/shared-messenger";

export async function boostrap() {
  await AppDataSource.initialize();

  const outboxRepository = new TypeOrmOutboxRepository(AppDataSource);

  const userRepository = new TypeOrmUserRepository(
    AppDataSource.getRepository(UserOrmEntity),
    outboxRepository,
  );

  const passwordHasher = new Argon2PasswordHasher();

  const createUserUsecase = CreateUserUseCase.create(
    userRepository,
    passwordHasher,
  );

  const loginUsecase = LoginUserUseCase.create(userRepository, passwordHasher);

  const deactivateUserUsecase = DeactivateUserUsecase.create(
    userRepository,
    passwordHasher,
  );

  const banUserUsecase = BanUserUsecase.create(userRepository);

  const suspendUserUsecase = SuspendUserUsecase.create(userRepository);
  const reactivateUserUsecase = ReactivateUserUsecase.create(userRepository);

  const services = ServiceHandler.create({
    createUser: grpcUnaryAdapter(CreateUserHandler(createUserUsecase)),
    login: grpcUnaryAdapter(loginUserHandler(loginUsecase)),
    deactivateUser: grpcUnaryAdapter(
      deactivateUserHandler(deactivateUserUsecase),
    ),
    banUser: grpcUnaryAdapter(banUserHandler(banUserUsecase)),
    suspendUser: grpcUnaryAdapter(suspendUserHandler(suspendUserUsecase)),
    reactivateUser: grpcUnaryAdapter(
      ReactivateUserHandler(reactivateUserUsecase),
    ),
  });

  const grpc = GrpcServer.create(services);
  const kafka = KafkaInitializer.create({
    clientId: "user-service",
    brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
  });
  await kafka.producerInitializer();

  const messagePublisher = MessagePublisher.create(kafka);

  const outboxWorker = OutboxWorker.create(messagePublisher, outboxRepository);

  grpc.start();
  await outboxWorker.start();
}
