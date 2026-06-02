import type * as grpc from "@grpc/grpc-js";
import { UserAlreadyExistsError } from "../../errors/application/user/user-already-exists.error";
import { AccountDisabledError } from "../../errors/application/user/user-account-disabled-error";
import {
  type ErrorConstructor,
  ErrorContract,
} from "../../errors/error-contract";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { InvalidCredentialsException } from "../../errors/application/user/invalid-credentials-exception.error";
import { ValueObjectError } from "../../errors/domain/value-object-error";

export class GrpcErrorMapper {
  private static readonly errorMap = new Map<ErrorConstructor, Status>([
    [UserAlreadyExistsError, Status.ALREADY_EXISTS],
    [ValueObjectError, Status.FAILED_PRECONDITION],
    [AccountDisabledError, Status.PERMISSION_DENIED],
    [InvalidCredentialsException, Status.UNAUTHENTICATED],
  ]);

  public static toGrpcError(error: Error): grpc.ServerErrorResponse {
    let response: grpc.ServerErrorResponse | null = null;

    const code = this.getStatus(error);

    response = {
      name: error.name,
      message: error.message,
      code,
    };

    if (error instanceof ErrorContract) {
      response.details = error.code;
    }

    return response;
  }

  public static unknownError(): grpc.ServerErrorResponse {
    const unknownError: grpc.ServerErrorResponse = {
      name: "UnknownError",
      code: Status.UNKNOWN,
      message: "An unknown error occurred.",
    };

    return unknownError;
  }

  private static getStatus(error: Error): number {
    const statusDefault = Status.INTERNAL; // Default
    for (const [ErrorClass, status] of this.errorMap) {
      if (error instanceof ErrorClass) {
        return status;
      }
    }
    return statusDefault;
  }
}
