import { UserStatus } from "../../../domain/entity/user/user.props";
import { type UserRepository } from "../../gateway/user-repository.gateway";
import { type PasswordHasher } from "../../../domain/services/password-hasher";
import { Email } from "../../../domain/value-object/email.value-object";
import { Password } from "../../../domain/value-object/password.value-object";
import { InvalidCredentialsException } from "../../../errors/application/user/invalid-credentials-exception.error";
import { AccountDisabledError } from "../../../errors/application/user/user-account-disabled-error";
import { type Usecase } from "../usecase";
import {
  type LoginUserDtoInput,
  type LoginUserDtoResult,
} from "./login-user.dto";

export class LoginUserUseCase implements Usecase<
  LoginUserDtoInput,
  LoginUserDtoResult
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
    hasher: PasswordHasher,
  ): LoginUserUseCase {
    return new LoginUserUseCase(userRepository, hasher);
  }

  async execute(input: LoginUserDtoInput): Promise<LoginUserDtoResult> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (
      user.getStatus().getValue() === UserStatus.BANNED ||
      user.getStatus().getValue() === UserStatus.SUSPENDED
    ) {
      throw new AccountDisabledError();
    }

    const hashed = user.getPassword();

    const isPasswordValid = await this.passwordHasher.compare(password, hashed);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const output: LoginUserDtoResult = {
      id: user.getId(),
    };

    return output;
  }
}
