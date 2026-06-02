import { Controller, Get } from "@nestjs/common";
import { GetJwksUsecase } from "../../../application/usecases/discovery/get-jwks.usecase";

@Controller(".well-known")
export class JwksController {
  constructor(private readonly getJwksUsecase: GetJwksUsecase) {}

  @Get("jwks.json")
  async getJwks() {
    return this.getJwksUsecase.execute();
  }
}
