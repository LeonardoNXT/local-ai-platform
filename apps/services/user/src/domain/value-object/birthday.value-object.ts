import { ValueObjectError } from "../../errors/domain/value-object-error";

export class InvalidBirthday extends ValueObjectError {
  public readonly name = "InvalidBirthday";
  public readonly code = "INVALID_BIRTHDAY";

  public constructor(message: string) {
    super(message);
  }
}

export class Birthday {
  private readonly date: Date;

  private constructor(date: Date) {
    this.date = date;
  }

  public static create(value: string | Date): Birthday {
    const birthDayDate = new Date(value);

    if (!Birthday.isValidDate(birthDayDate)) {
      throw new InvalidBirthday("Invalid birthday date.");
    }

    if (!Birthday.isValidBirthdayDate(birthDayDate)) {
      throw new InvalidBirthday("Invalid Birthday: Is a minor.");
    }

    return new Birthday(birthDayDate);
  }

  private static isValidDate(value: Date): boolean {
    return !isNaN(value.getTime());
  }

  private static isValidBirthdayDate(birthday: Date): boolean {
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const month = today.getMonth() - birthday.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }

    const isValid = age >= 18;

    return isValid;
  }

  public getValue(): Date {
    return this.date;
  }

  public equals(other: Birthday): boolean {
    return this.date.getTime() === other.date.getTime();
  }
}
