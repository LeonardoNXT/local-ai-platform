import { Body, Controller, Post } from "@nestjs/common";
import { LoginWithPasswordUsecase } from "../../../application/usecases/login/login-with-password.usecase";
import { LoginRequestDto } from "../dtos/login-request.dto";

@Controller()
export class AuthController {
  constructor(
    private readonly loginWithPasswordUsecase: LoginWithPasswordUsecase,
  ) {}

  @Post("login")
  async login(@Body() body: LoginRequestDto) {
    return this.loginWithPasswordUsecase.execute({
      email: body.email,
      password: body.password,
    });
  }
}
