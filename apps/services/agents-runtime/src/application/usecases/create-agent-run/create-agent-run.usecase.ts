import type UseCase from "../usecase.ts";
import AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import type ClockPort from "../../ports/clock.port.ts";
import type IdGeneratorPort from "../../ports/id-generator.ts";
import type AgentRunRepositoryPort from "../../ports/agent-run-repository.port.ts";
import type {
  CreateAgentRunInputDto,
  CreateAgentRunOutputDto,
} from "./create-agent-run.dto.ts";

export default class CreateAgentRunUsecase implements UseCase<
  CreateAgentRunInputDto,
  CreateAgentRunOutputDto
> {
  public constructor(
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
    private readonly repository: AgentRunRepositoryPort,
  ) {}

  public async execute(
    input: CreateAgentRunInputDto,
  ): Promise<CreateAgentRunOutputDto> {
    const id = this.idGenerator.generate();
    const eventId = this.idGenerator.generate();
    const jobId = this.idGenerator.generate();
    const date = this.clock.nowIsoString();

    const agentRun = AgentRunEntity.create(
      id,
      eventId,
      {
        userId: input.userId,
        createdAt: date,
        updatedAt: date,
      },
      {
        availableAt: this.clock.nowIsoString(),
        jobId: jobId,
      },
    );

    await this.repository.save(agentRun);

    return {
      runId: agentRun.id,
      createdAt: date,
    };
  }
}
