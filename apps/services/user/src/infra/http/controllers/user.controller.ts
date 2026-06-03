import { Body, Controller, Inject, Post } from "@nestjs/common";
import { CreateUserInputDto } from "../dtos/create-user.dto";
import { UseCases } from "../../../others/initializer/usecases";
import { USER_USECASES } from "../nest/tokens";

@Controller("users")
export class UserController {
  public constructor(
    @Inject(USER_USECASES) private readonly usecases: UseCases,
  ) {}

  @Post()
  public async create(@Body() body: CreateUserInputDto) {
    const response = await this.usecases.createUserUsecase.execute(body);

    return {
      id: response.id,
    };
  }
}
