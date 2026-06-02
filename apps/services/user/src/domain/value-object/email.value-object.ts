import { ValueObjectError } from "../../errors/domain/value-object-error";

export class InvalidEmailError extends ValueObjectError {
  public readonly name = "InvalidEmail";
  public readonly code = "INVALID_EMAIL";

  public constructor(email: string) {
    super(`Invalid email: ${email}`);
  }
}

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    if (!email) {
      throw new InvalidEmailError(email);
    }

    const normalized = email.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new InvalidEmailError(email);
    }

    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
