import { type UserRepository } from "../../application/gateway/user-repository.gateway";
import { CreateUserUseCase } from "../../application/usecases/create-user/create-user.usecase";
import { LoginUserUseCase } from "../../application/usecases/login-user/login-user.usecase";
import { BanUserUsecase } from "../../application/usecases/status/ban-user/ban-user.usecase";
import { DeactivateUserUsecase } from "../../application/usecases/status/deactivate-user/deactivate-user.usecase";
import { ReactivateUserUsecase } from "../../application/usecases/status/reactivate-user/reactivate-user.usecase";
import { SuspendUserUsecase } from "../../application/usecases/status/suspend-user/suspend.usecase.dto";
import { type PasswordHasher } from "../../domain/services/password-hasher";

export type UseCases = {
  createUserUsecase: CreateUserUseCase;
  loginUsecase: LoginUserUseCase;
  deactivateUserUsecase: DeactivateUserUsecase;
  banUserUsecase: BanUserUsecase;
  suspendUserUsecase: SuspendUserUsecase;
  reactivateUserUsecase: ReactivateUserUsecase;
};

export class UseCasesInitializer {
  public static all({
    userRepository,
    passwordHasher,
  }: {
    userRepository: UserRepository;
    passwordHasher: PasswordHasher;
  }) {
    const createUserUsecase = CreateUserUseCase.create(
      userRepository,
      passwordHasher,
    );

    const loginUsecase = LoginUserUseCase.create(
      userRepository,
      passwordHasher,
    );

    const deactivateUserUsecase = DeactivateUserUsecase.create(
      userRepository,
      passwordHasher,
    );

    const banUserUsecase = BanUserUsecase.create(userRepository);

    const suspendUserUsecase = SuspendUserUsecase.create(userRepository);

    const reactivateUserUsecase = ReactivateUserUsecase.create(userRepository);

    return {
      createUserUsecase,
      loginUsecase,
      deactivateUserUsecase,
      banUserUsecase,
      suspendUserUsecase,
      reactivateUserUsecase,
    };
  }
}
