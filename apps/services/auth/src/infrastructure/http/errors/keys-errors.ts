import {
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

export class ActiveSigningKeyNotFoundException extends InternalServerErrorException {
  constructor() {
    super({
      name: "ActiveSigningKeyNotFound",
      code: "ACTIVE_SIGNING_KEY_NOT_FOUND",
      message: "No active signing key was found.",
    });
  }
}

export class InvalidJwtTokenException extends UnauthorizedException {
  constructor() {
    super({
      name: "InvalidJwtToken",
      code: "INVALID_JWT_TOKEN",
      message: "Invalid or expired token.",
    });
  }
}
