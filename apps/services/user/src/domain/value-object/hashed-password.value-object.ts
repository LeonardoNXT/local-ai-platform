import { ValueObjectError } from "../../errors/domain/value-object-error";

export class InvalidHashedPassword extends ValueObjectError {
  public readonly name = "InvalidHashedPassword";
  public readonly code = "INVALID_HASHED_PASSWORD";

  public constructor() {
    super("Invalid hashed password.");
  }
}

export class HashedPassword {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): HashedPassword {
    if (!value || typeof value !== "string") {
      throw new InvalidHashedPassword();
    }

    return new HashedPassword(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: HashedPassword): boolean {
    return this.value === other.value;
  }
}
