import { ValueObjectError } from "../../errors/domain/value-object-error";

export class InvalidPassword extends ValueObjectError {
  public readonly name = "InvalidPassword";
  public readonly code = "INVALID_PASSWORD";

  public constructor() {
    super("Invalid password.");
  }
}

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Password {
    if (!Password.isValidPassword(value)) {
      throw new InvalidPassword();
    }

    return new Password(value);
  }

  private static isValidPassword(value: string): boolean {
    if (!value) return false;

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return regex.test(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Password): boolean {
    return this.value === other.value;
  }
}
