import { type User } from "@local-ai/shared-grpc";
import { type CreateUserUseCase } from "../../../../../application/usecases/create-user/create-user.usecase";

type CreateUserInputDtoInfra = Pick<
  User.CreateUserRequest,
  "name" | "username" | "birthday" | "email" | "password" | "isEmailVerified"
>;
type CreateUserOutputDtoInfra = Pick<User.CreateUserResponse, "id">;

export function CreateUserHandler(createUserUsecase: CreateUserUseCase) {
  return async (
    input: CreateUserInputDtoInfra,
  ): Promise<CreateUserOutputDtoInfra> => {
    const result = await createUserUsecase.execute(input);
    const response: CreateUserOutputDtoInfra = {
      id: result.id,
    };
    return response;
  };
}
