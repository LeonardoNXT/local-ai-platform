import type { OutboxPort } from "@local-ai/shared-messenger";
import type AgentRunRepositoryPort from "../../../application/ports/agent-run-repository.port.ts";
import AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import AgentRunMapper from "../mappers/agent-run.mapper.ts";
import Repository from "./repositories.ts";
import type { DataSource } from "typeorm";
import type InternalAgentJobComposition from "../composition/internal-agent-run-job.composition.ts";
import { FIND_PENDING_JOBS_QUERY } from "../queries/agent-run-find-pending-jobs.query.ts";

export default class AgentRunRepository
  extends Repository
  implements AgentRunRepositoryPort
{
  public constructor(
    protected readonly dataSource: DataSource,
    private readonly jobRepository: InternalAgentJobComposition,
    private readonly outboxRepository: OutboxPort,
  ) {
    super(dataSource);
  }

  public async save(payload: AgentRunEntity): Promise<void> {
    const ormEntity = AgentRunMapper.toOrm(payload);
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(AgentRunEntity).save(ormEntity);
      await this.outboxRepository.save(payload.domainEvents, manager);
      await this.jobRepository.save(payload.internalJobs, manager);
    });
  }

  public async findPending(): Promise<AgentRunEntity[]> {
    const repository = this.repository(AgentRunEntity);

    const entities = await repository.query<AgentRunEntity[]>(
      FIND_PENDING_JOBS_QUERY,
    );

    entities.map((entity) => AgentRunMapper.toDomain(entity));

    return entities;
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository(AgentRunEntity).delete(payload.id);
  }
}
