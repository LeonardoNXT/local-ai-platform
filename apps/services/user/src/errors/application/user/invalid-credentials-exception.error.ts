import { ApplicationError } from "../application-error";

export class InvalidCredentialsException extends ApplicationError {
  public readonly name = "InvalidCredentialsException";
  public readonly code = "INVALID_CREDENTIALS_EXCEPTION";

  constructor() {
    super("Invalid credentials provided");
  }
}
