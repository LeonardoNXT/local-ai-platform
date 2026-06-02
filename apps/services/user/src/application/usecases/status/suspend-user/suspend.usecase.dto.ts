import { type UserRepository } from "../../../gateway/user-repository.gateway";
import { InvalidCredentialsException } from "../../../../errors/application/user/invalid-credentials-exception.error";
import { type Usecase } from "../../usecase";
import {
  type SuspendUserDtoInput,
  type SuspendUserDtoResult,
} from "./suspend-user.dto";

export class SuspendUserUsecase implements Usecase<
  SuspendUserDtoInput,
  SuspendUserDtoResult
> {
  private readonly userRepository: UserRepository;

  private constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public static create(userRepository: UserRepository): SuspendUserUsecase {
    return new SuspendUserUsecase(userRepository);
  }

  async execute(input: SuspendUserDtoInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    user.markAsSuspended();

    await this.userRepository.save(user);
  }
}
