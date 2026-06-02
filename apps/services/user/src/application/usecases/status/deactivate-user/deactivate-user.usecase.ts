import { type UserRepository } from "../../../gateway/user-repository.gateway";
import { type PasswordHasher } from "../../../../domain/services/password-hasher";
import { Password } from "../../../../domain/value-object/password.value-object";
import { InvalidCredentialsException } from "../../../../errors/application/user/invalid-credentials-exception.error";
import { type Usecase } from "../../usecase";
import {
  type DeactivateUserDtoInput,
  type DeactivateUserDtoResult,
} from "./deactivate-user.dto";

export class DeactivateUserUsecase implements Usecase<
  DeactivateUserDtoInput,
  DeactivateUserDtoResult
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
  ): DeactivateUserUsecase {
    return new DeactivateUserUsecase(userRepository, passwordHasher);
  }

  async execute(
    input: DeactivateUserDtoInput,
  ): Promise<DeactivateUserDtoResult> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const plainPassword = Password.create(input.password);

    if (
      !(await this.passwordHasher.compare(plainPassword, user.getPassword()))
    ) {
      throw new InvalidCredentialsException();
    }

    const deletedAt = new Date();
    deletedAt.setDate(deletedAt.getDate() + 30);

    user.deactivateUser(deletedAt);

    await this.userRepository.save(user);

    return {
      deletedAt: deletedAt.toString(),
    };
  }
}
