import { type User } from "@local-ai/shared-grpc";
import { type BanUserUsecase } from "../../../../../application/usecases/status/ban-user/ban-user.usecase";
import { Empty } from "@local-ai/shared-grpc";

type BanUserInputDto = Pick<User.BanUserRequest, "id" | "reason">;

export function banUserHandler(banUserUsecase: BanUserUsecase) {
  return async (input: BanUserInputDto): Promise<typeof Empty> => {
    await banUserUsecase.execute(input);

    return Empty;
  };
}
