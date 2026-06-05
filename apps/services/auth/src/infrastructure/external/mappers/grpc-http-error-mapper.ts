import { status } from "@grpc/grpc-js";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

type GrpcError = {
  code?: number;
  details?: string;
  message?: string;
};

export class GrpcToHttpErrorMapper {
  public static throw(error: unknown): never {
    const grpcError = error as GrpcError;

    switch (grpcError.code) {
      case status.UNAUTHENTICATED:
        throw new UnauthorizedException({
          code: grpcError.details ?? "UNAUTHENTICATED",
          message: "Invalid credentials provided",
        });

      case status.ALREADY_EXISTS:
        throw new ConflictException({
          code: grpcError.details ?? "ALREADY_EXISTS",
          message: "Resource already exists",
        });

      case status.PERMISSION_DENIED:
        throw new ForbiddenException({
          code: grpcError.details ?? "PERMISSION_DENIED",
          message: "Permission denied",
        });

      case status.FAILED_PRECONDITION:
      case status.INVALID_ARGUMENT:
        throw new BadRequestException({
          code: grpcError.details ?? "BAD_REQUEST",
          message: grpcError.message ?? "Invalid request",
        });

      default:
        throw new InternalServerErrorException({
          code: grpcError.details ?? "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
    }
  }
}
