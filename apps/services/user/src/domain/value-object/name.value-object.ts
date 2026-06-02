import { ValueObjectError } from "../../errors/domain/value-object-error";

export class InvalidName extends ValueObjectError {
  public readonly name = "InvalidName";
  public readonly code = "INVALID_NAME";

  public constructor(message: string) {
    super(message);
  }
}

export class Name {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Name {
    if (!Name.isValidName(value)) {
      throw new InvalidName(
        "The name is invalid because it does not follow the allowed pattern.",
      );
    }
    return new Name(value.trim());
  }
  private static isValidName(value: string): boolean {
    const regex = /^[\p{L}\s]+$/u;
    const trimmed = value.trim();
    return trimmed.length >= 3 && regex.test(trimmed);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Name): boolean {
    return this.value === other.value;
  }
}
