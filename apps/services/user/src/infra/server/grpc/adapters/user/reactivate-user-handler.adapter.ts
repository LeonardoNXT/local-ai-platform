import { type User } from "@local-ai/shared-grpc";
import { type ReactivateUserUsecase } from "../../../../../application/usecases/status/reactivate-user/reactivate-user.usecase";
import { Empty } from "@local-ai/shared-grpc";

type ReactivateUserInputDto = Pick<User.ReactivateUserRequest, "id">;

export function ReactivateUserHandler(
  reactivateUserUsecase: ReactivateUserUsecase,
) {
  return async (input: ReactivateUserInputDto): Promise<typeof Empty> => {
    await reactivateUserUsecase.execute(input);

    return Empty;
  };
}
