import * as grpc from "@grpc/grpc-js";
import { User } from "@local-ai/shared-grpc";
import { EnvironmentException } from "../../../errors/infra/env-exception";
import { type ServiceGrpcContract } from "./services/service-contract.grpc";

export class GrpcServer {
  private readonly server: grpc.Server = new grpc.Server();
  private readonly servicesHandler: ServiceGrpcContract;

  private constructor(servicesHandler: ServiceGrpcContract) {
    this.servicesHandler = servicesHandler;
  }

  public static create(servicesHandler: ServiceGrpcContract): GrpcServer {
    return new GrpcServer(servicesHandler);
  }

  public start(): void {
    if (!User) return;

    this.server.addService(
      User.UserService,
      this.servicesHandler.get() as grpc.UntypedServiceImplementation,
    );

    if (!process.env.GRPC_PORT) {
      throw new EnvironmentException(
        "GRPC_PORT environment variable is required.",
      );
    }

    const port = process.env.GRPC_PORT;

    this.server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        console.log("gRPC SERVER IS RUNNING");
      },
    );
  }
}
