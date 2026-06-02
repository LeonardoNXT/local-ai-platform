import { type User } from "@local-ai/shared-grpc";
import {
  type ServiceGrpcContract,
  type UseServerDependencies,
} from "./service-contract.grpc";

export class ServiceHandler implements ServiceGrpcContract {
  private readonly dependencies: UseServerDependencies;

  private constructor(deps: UseServerDependencies) {
    this.dependencies = deps;
  }

  public static create(deps: UseServerDependencies): ServiceHandler {
    return new ServiceHandler(deps);
  }

  public get(): User.UserServer {
    return this.dependencies;
  }
}
