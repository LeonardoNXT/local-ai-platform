import { ApplicationError } from "../application-error";

export class UserAlreadyExistsError extends ApplicationError {
  public readonly name = "UserAlreadyExistsError";
  public readonly code = "ALREADY_EXISTS";

  constructor() {
    super("User with this email already exists.");
  }
}
