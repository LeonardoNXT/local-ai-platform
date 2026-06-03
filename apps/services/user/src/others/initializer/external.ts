import {
  KafkaInitializer,
  MessagePublisher,
  type OutboxPort,
} from "@local-ai/shared-messenger";
import { OutboxWorker } from "@local-ai/shared-messenger";
import { grpcUnaryAdapter } from "../../infra/server/grpc/adapters/unary-adapter";
import { banUserHandler } from "../../infra/server/grpc/adapters/user/ban-user-handler.adapter";
import { CreateUserHandler } from "../../infra/server/grpc/adapters/user/create-user-handler.adapter";
import { deactivateUserHandler } from "../../infra/server/grpc/adapters/user/deactivate-user-handler.adapter";
import { loginUserHandler } from "../../infra/server/grpc/adapters/user/login-user-handler.adapter";
import { ReactivateUserHandler } from "../../infra/server/grpc/adapters/user/reactivate-user-handler.adapter";
import { suspendUserHandler } from "../../infra/server/grpc/adapters/user/suspended-user-handler.adapter";
import { GrpcServer } from "../../infra/server/grpc/server.grpc";
import { ServiceHandler } from "../../infra/server/grpc/services/service-handler.grpc";
import { type UseCases } from "./usecases";

export class ExternalInitializer {
  public static async all({
    usecases,
    outboxRepository,
  }: {
    usecases: UseCases;
    outboxRepository: OutboxPort;
  }) {
    const grpcServices = ServiceHandler.create({
      createUser: grpcUnaryAdapter(
        CreateUserHandler(usecases.createUserUsecase),
      ),
      login: grpcUnaryAdapter(loginUserHandler(usecases.loginUsecase)),
      deactivateUser: grpcUnaryAdapter(
        deactivateUserHandler(usecases.deactivateUserUsecase),
      ),
      banUser: grpcUnaryAdapter(banUserHandler(usecases.banUserUsecase)),
      suspendUser: grpcUnaryAdapter(
        suspendUserHandler(usecases.suspendUserUsecase),
      ),
      reactivateUser: grpcUnaryAdapter(
        ReactivateUserHandler(usecases.reactivateUserUsecase),
      ),
    });

    const grpc = GrpcServer.create(grpcServices);

    const kafka = KafkaInitializer.create({
      clientId: "user-service",
      brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
    });

    await kafka.producerInitializer();

    const messagePublisher = MessagePublisher.create(kafka);

    const outboxWorker = OutboxWorker.create(
      messagePublisher,
      outboxRepository,
    );

    return {
      grpc,
      kafka,
      messagePublisher,
      outboxWorker,
    };
  }
}
