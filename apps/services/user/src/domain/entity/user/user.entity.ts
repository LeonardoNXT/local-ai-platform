import { UserBannedDomainEvent } from "../../events/user-banned/user-banned.domain-event";
import { UserCreatedDomainEvent } from "../../events/user-created/user-created.domain-event";
import { AggregateRoot } from "../../shared/aggregate-root";
import { type Birthday } from "../../value-object/birthday.value-object";
import { type Email } from "../../value-object/email.value-object";
import { type HashedPassword } from "../../value-object/hashed-password.value-object";
import { type Name } from "../../value-object/name.value-object";
import { type Reason } from "../../value-object/reason.value-objects";
import { Status } from "../../value-object/status.value-object";
import { type CreateUserProps, type UserProps, UserStatus } from "./user.props";

export class User extends AggregateRoot {
  private constructor(private props: UserProps) {
    super();
  }

  public static create(props: CreateUserProps): User {
    const user = new User({
      id: crypto.randomUUID(),
      ...props,
      isEmailVerified: false,
      status: Status.create(UserStatus.ACTIVE),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHistory: [],
    });

    user.addDomainEvent(
      new UserCreatedDomainEvent(user.getId(), {
        email: user.getEmail().getValue(),
      }),
    );

    return user;
  }

  public static restore(props: UserProps): User {
    return new User(props);
  }

  public markEmailAsVerified(): void {
    this.props.isEmailVerified = true;
    this.onUpdate();
  }

  public changePassword(newPassword: HashedPassword): void {
    this.props.passwordHistory.push(this.props.hashedPassword);
    this.props.hashedPassword = newPassword;
    this.onUpdate();
  }

  public changeEmail(email: Email) {
    this.props.email = email;
    this.onUpdate();
  }

  public markAsSuspended(): void {
    this.props.status = this.props.status.suspend();
    this.onUpdate();
  }

  public markAsBanned(reason: Reason): void {
    if (this.props.status.getValue() === UserStatus.DEACTIVATED) {
      this.props.deletedAt = null;
    }

    this.props.status = this.props.status.ban();

    this.onUpdate();

    this.addDomainEvent(
      new UserBannedDomainEvent(this.props.id, {
        email: this.props.email.getValue(),
        reason: reason.getValue(),
      }),
    );
  }

  public deactivateUser(deletedAt: Date): void {
    this.props.deletedAt = deletedAt;
    this.props.status = this.props.status.deactivate();
    this.onUpdate();
  }

  public reactivateUser(): void {
    this.props.deletedAt = null;
    this.props.status = this.props.status.reactivate();
    this.onUpdate();
  }

  public getId(): string {
    return this.props.id;
  }

  public getName(): Name {
    return this.props.name;
  }

  public getUserName(): Name {
    return this.props.username;
  }

  public getEmail(): Email {
    return this.props.email;
  }

  public getIsEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  public getPassword(): HashedPassword {
    return this.props.hashedPassword;
  }

  public getPasswordHistory(): readonly HashedPassword[] {
    return [...this.props.passwordHistory];
  }

  public getBirthday(): Birthday {
    return this.props.birthday;
  }

  public getStatus(): Status {
    return this.props.status;
  }

  public getDeletedAt(): Date | null {
    return this.props.deletedAt;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  private onUpdate(): void {
    this.props.updatedAt = new Date();
  }
}
