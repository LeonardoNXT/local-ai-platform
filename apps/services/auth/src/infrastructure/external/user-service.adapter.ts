import { Injectable } from "@nestjs/common";
import { User } from "@local-ai/shared-grpc";
import { credentials } from "@grpc/grpc-js";
import type { LoginResponse } from "@local-ai/shared-grpc/dist/generated/user-service/user";
import { UserProviderPort } from "../../application/ports/user-provider.port";
import { GrpcToHttpErrorMapper } from "./mappers/grpc-http-error-mapper";

@Injectable()
export class UserServiceAdapter implements UserProviderPort {
  private readonly client: User.UserClient;

  public constructor() {
    this.client = new User.UserClient(
      process.env.USER_GRPC_URL ?? "localhost:50051",
      credentials.createInsecure(),
    );
  }

  public async validateCredentials(input: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      return await this.login(input.email, input.password);
    } catch (error) {
      GrpcToHttpErrorMapper.throw(error);
    }
  }

  private async login(email: string, password: string): Promise<LoginResponse> {
    return await new Promise((resolve, reject) => {
      this.client.login({ email, password }, (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        if (!response?.id) {
          reject(new Error("Invalid gRPC response: missing user id."));
          return;
        }

        resolve({
          id: response.id,
        });
      });
    });
  }
}
