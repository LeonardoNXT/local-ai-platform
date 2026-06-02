import { type User } from "@local-ai/shared-grpc";

export type UseServerDependencies = User.UserServer;

export interface ServiceGrpcContract {
  get(): User.UserServer;
}
