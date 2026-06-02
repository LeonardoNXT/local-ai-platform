import { ValueObjectError } from "../../value-object-error";

export class InvalidStatusError extends ValueObjectError {
  public readonly name = "InvalidStatusError";
  public readonly code = "INVALID_STATUS_ERROR";

  public constructor(message: string) {
    super(message);
  }
}
