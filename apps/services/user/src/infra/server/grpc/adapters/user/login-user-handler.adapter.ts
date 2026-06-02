import { type User } from "@local-ai/shared-grpc";
import { type LoginUserUseCase } from "../../../../../application/usecases/login-user/login-user.usecase";

type LoginInputDtoInfra = Pick<User.LoginRequest, "email" | "password">;
type LoginOutputDtoInfra = Pick<User.LoginResponse, "id">;

export function loginUserHandler(loginUserUseCase: LoginUserUseCase) {
  return async (input: LoginInputDtoInfra): Promise<LoginOutputDtoInfra> => {
    const result = await loginUserUseCase.execute(input);

    const response: LoginOutputDtoInfra = {
      id: result.id,
    };

    return response;
  };
}
