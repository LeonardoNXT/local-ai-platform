import { InvalidCredentialsException } from "../../../../errors/application/user/invalid-credentials-exception.error";
import { type UserRepository } from "../../../gateway/user-repository.gateway";
import { type Usecase } from "../../usecase";
import {
  type ReactivateUserDtoInput,
  type ReactivateUserDtoResult,
} from "./reactivate-user.dto";

export class ReactivateUserUsecase implements Usecase<
  ReactivateUserDtoInput,
  ReactivateUserDtoResult
> {
  private readonly userRepository: UserRepository;

  private constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public static create(userRepository: UserRepository): ReactivateUserUsecase {
    return new ReactivateUserUsecase(userRepository);
  }

  async execute(input: ReactivateUserDtoInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    user.reactivateUser();

    await this.userRepository.save(user);

    return;
  }
}
