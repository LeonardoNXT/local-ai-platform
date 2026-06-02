import { InvalidStatusError } from "../../errors/domain/value-object/user/invalid-status.error";
import { UserStatus } from "../entity/user/user.props";

export class Status {
  private readonly value: UserStatus;

  private constructor(value: UserStatus) {
    this.value = value;
  }

  public static create(status: UserStatus): Status {
    return new Status(status);
  }

  public deactivate(): Status {
    if (this.value === UserStatus.DEACTIVATED) {
      throw new InvalidStatusError("Status already deactivated.");
    }

    return new Status(UserStatus.DEACTIVATED);
  }

  public suspend(): Status {
    if (this.value === UserStatus.SUSPENDED) {
      throw new InvalidStatusError("Status already suspended.");
    }

    if (this.value === UserStatus.BANNED) {
      throw new InvalidStatusError("Cannot suspend a banned user.");
    }

    return new Status(UserStatus.SUSPENDED);
  }

  public ban(): Status {
    if (this.value === UserStatus.BANNED) {
      throw new InvalidStatusError("Status already banned.");
    }
    return new Status(UserStatus.BANNED);
  }

  public reactivate(): Status {
    if (this.value === UserStatus.ACTIVE) {
      throw new InvalidStatusError("Status already Actived.");
    }
    return new Status(UserStatus.ACTIVE);
  }

  public getValue(): UserStatus {
    return this.value;
  }
}
