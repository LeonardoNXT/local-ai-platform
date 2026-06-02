import { type User } from "@local-ai/shared-grpc";
import { type SuspendUserUsecase } from "../../../../../application/usecases/status/suspend-user/suspend.usecase.dto";
import { Empty } from "@local-ai/shared-grpc";

type SuspendUserInputDto = Pick<User.SuspendUserRequest, "id">;

export function suspendUserHandler(suspendedUserUsecase: SuspendUserUsecase) {
  return async (input: SuspendUserInputDto): Promise<typeof Empty> => {
    await suspendedUserUsecase.execute(input);

    return Empty;
  };
}
