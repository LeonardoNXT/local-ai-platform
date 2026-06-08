import { User } from "../../../domain/entity/user/user.entity";
import { type UserRepository } from "../../gateway/user-repository.gateway";
import { type PasswordHasher } from "../../../domain/services/password-hasher";
import { Birthday } from "../../../domain/value-object/birthday.value-object";
import { Email } from "../../../domain/value-object/email.value-object";
import { Name } from "../../../domain/value-object/name.value-object";
import { Password } from "../../../domain/value-object/password.value-object";
import { type Usecase } from "../usecase";
import {
  type CreateUserInputDto,
  type CreateUserResult,
} from "./create-user.dto";

export class CreateUserUseCase implements Usecase<
  CreateUserInputDto,
  CreateUserResult
> {
  private readonly userRepository: UserRepository;
  private readonly passwordHasher: PasswordHasher;

  private constructor(
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
  ) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  public static create(
    userRepository: UserRepository,
    passwordHasher: PasswordHasher,
  ): CreateUserUseCase {
    return new CreateUserUseCase(userRepository, passwordHasher);
  }

  public async execute(input: CreateUserInputDto): Promise<CreateUserResult> {
    const start = Date.now();
    const name = Name.create(input.name);
    const username = Name.create(input.username);
    const email = Email.create(input.email);
    const password = Password.create(input.password);
    const birthday = Birthday.create(input.birthday);
    const verified = input.isEmailVerified;

    const hashedPassword = await this.passwordHasher.hash(password);

    const user = User.create({
      name: name,
      username: username,
      email: email,
      hashedPassword: hashedPassword,
      birthday: birthday,
      isEmailVerified: verified,
    });

    await this.userRepository.save(user);

    const output: CreateUserResult = {
      id: user.getId(),
    };

    console.log({
      location: "USER-CREATE-USECASE",
      delay: Date.now() - start + "ms",
    });

    return output;
  }
}
