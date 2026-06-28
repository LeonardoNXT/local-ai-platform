import AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import type AgentRunRepository from "../../../infra/persistence/repositories/agent-run.repository.ts";
import type ClockPort from "../../ports/clock.port.ts";
import type IdGeneratorPort from "../../ports/id-generator.ts";
import type UseCase from "../usecase.ts";
import type {
  CreatePlanAgentRunInput,
  CreatePlanAgentRunOutput,
} from "./create-plan-agent-run.dto.ts";

export default class CreatePlanAgentRunUsecase implements UseCase<
  CreatePlanAgentRunInput,
  CreatePlanAgentRunOutput
> {
  public constructor(
    private readonly repository: AgentRunRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort,
  ) {}

  public async execute(
    input: CreatePlanAgentRunInput,
  ): Promise<CreatePlanAgentRunOutput> {
    const agentRun = AgentRunEntity.recreate({
      artifacts: input.artifacts,
      createdAt: input.createdAt,
      currentStepIndex: input.currentStepIndex,
      id: input.id,
      plan: input.plan,
      planning: input.planning,
      status: input.status,
      updatedAt: input.updatedAt,
      userId: input.userId,
    });
  }
}
