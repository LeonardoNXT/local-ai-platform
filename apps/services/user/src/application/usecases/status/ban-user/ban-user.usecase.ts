import { type UserRepository } from "../../../gateway/user-repository.gateway";
import { Reason } from "../../../../domain/value-object/reason.value-objects";
import { InvalidCredentialsException } from "../../../../errors/application/user/invalid-credentials-exception.error";
import { type Usecase } from "../../usecase";
import { type BanUserDtoInput, type BanUserDtoResult } from "./ban-user.dto";

export class BanUserUsecase implements Usecase<
  BanUserDtoInput,
  BanUserDtoResult
> {
  private readonly userRepository: UserRepository;

  private constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public static create(userRepository: UserRepository): BanUserUsecase {
    return new BanUserUsecase(userRepository);
  }

  async execute(input: BanUserDtoInput): Promise<void> {
    const user = await this.userRepository.findById(input.id);
    const reason = Reason.create(input.reason);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    user.markAsBanned(reason);

    await this.userRepository.save(user);
  }
}
