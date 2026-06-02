import { type User } from "@local-ai/shared-grpc";
import { type DeactivateUserUsecase } from "../../../../../application/usecases/status/deactivate-user/deactivate-user.usecase";

type DeactivateUserInputDtoInfra = Pick<
  User.DeactivateUserRequest,
  "id" | "password"
>;
type DeactivateUserOutputDtoInfra = Pick<
  User.DeactivateUserResponse,
  "deletedAt"
>;

export function deactivateUserHandler(
  deactivateUserUsecase: DeactivateUserUsecase,
) {
  return async (
    input: DeactivateUserInputDtoInfra,
  ): Promise<DeactivateUserOutputDtoInfra> => {
    const result = await deactivateUserUsecase.execute(input);

    const response: DeactivateUserOutputDtoInfra = {
      deletedAt: result.deletedAt,
    };

    return response;
  };
}
