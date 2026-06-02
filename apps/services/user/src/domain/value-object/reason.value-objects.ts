import { ValueObjectError } from "../../errors/domain/value-object-error";

class InvalidReasonException extends ValueObjectError {
  public readonly name = "InvalidReason";
  public readonly code = "INVALID_REASON";
  constructor(cause: string) {
    super(cause);
  }
}

export class Reason {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Reason {
    if (value.length < 3) {
      throw new InvalidReasonException("This reason is very small.");
    }

    return new Reason(value);
  }

  public getValue(): string {
    return this.value;
  }
}
