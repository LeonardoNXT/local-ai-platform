import type { Usecase } from "../usecase.ts";
import type {
  CreateAgentRunInputDto,
  CreateAgentRunOutputDto,
} from "./create-agent-run.dto.ts";

export default class CreateAgentRuntimeUsecase implements Usecase<
  CreateAgentRunInputDto,
  CreateAgentRunOutputDto
> {
  public execute(
    input: CreateAgentRunInputDto,
  ): Promise<CreateAgentRunOutputDto> {}
}
