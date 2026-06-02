import { User } from "../../domain/entity/user/user.entity";
import { Birthday } from "../../domain/value-object/birthday.value-object";
import { Email } from "../../domain/value-object/email.value-object";
import { HashedPassword } from "../../domain/value-object/hashed-password.value-object";
import { Name } from "../../domain/value-object/name.value-object";
import { Status } from "../../domain/value-object/status.value-object";
import { UserOrmEntity } from "../database/entities/user.orm-entity";

export class UserOrmMapper {
  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    orm.id = user.getId();
    orm.name = user.getName().getValue();
    orm.username = user.getUserName().getValue();
    orm.email = user.getEmail().getValue();
    orm.password = user.getPassword().getValue();
    orm.birthday = user.getBirthday().getValue();
    orm.isEmailVerified = user.getIsEmailVerified();
    orm.passwordHistory = user
      .getPasswordHistory()
      .map((password) => password.getValue());
    orm.status = user.getStatus().getValue();
    orm.deletedAt = user.getDeletedAt();
    orm.createdAt = user.getCreatedAt();
    orm.updatedAt = user.getUpdatedAt();

    return orm;
  }

  static toDomain(entity: UserOrmEntity): User {
    return User.restore({
      id: entity.id,
      name: Name.create(entity.name),
      username: Name.create(entity.username),
      email: Email.create(entity.email),
      hashedPassword: HashedPassword.create(entity.password),
      birthday: Birthday.create(entity.birthday),
      isEmailVerified: entity.isEmailVerified,
      passwordHistory: entity.passwordHistory.map((password) =>
        HashedPassword.create(password),
      ),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      updatedAt: entity.updatedAt,
      status: Status.create(entity.status),
    });
  }
}
