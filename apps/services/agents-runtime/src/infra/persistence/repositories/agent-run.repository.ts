import type { DataSource } from "typeorm";
import type AgentRunRepositoryPort from "../../../application/ports/agent-run-repository.port.ts";
import type AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import { AgentRunEntityOrm } from "../entities/agent-run-orm.entity.ts";
import Repository from "./repositories.ts";
import type InternalAgentJobComposition from "../composition/internal-agent-run-job.composition.ts";
import type { OutboxPort } from "@local-ai/shared-messenger";
import AgentRunMapper from "../mappers/agent-run.mapper.ts";
import type { Status } from "../../../domain/entities/agent-run/agent-run.props.ts";

export default class AgentRunRepository
  extends Repository
  implements AgentRunRepositoryPort
{
  public constructor(
    dataSource: DataSource,
    private readonly internalAgentJobComposition: InternalAgentJobComposition,
    private readonly outboxRepository: OutboxPort,
  ) {
    super(dataSource);
  }

  public async delete(payload: { id: string }): Promise<void> {
    const repository = this.repository(AgentRunEntityOrm);

    await repository.delete(payload.id);
  }

  public async findPending(): Promise<AgentRunEntity[]> {
    const query = `
    WITH selected_jobs AS (
      SELECT id
      FROM internal_agent_run_job
      WHERE status = 'pending'
        AND available_at <= NOW()
      ORDER BY created_at ASC
      LIMIT 10
      FOR UPDATE SKIP LOCKED
    ),
    updated_jobs AS (
      UPDATE internal_agent_run_job AS job
      SET
        status = 'processing',
        attempts = job.attempts + 1,
        updated_at = NOW()
      FROM selected_jobs
      WHERE job.id = selected_jobs.id
      RETURNING job.*
    )
    SELECT run.*
    FROM agent_run AS run
    INNER JOIN updated_jobs AS job
      ON job.run_id = run.id;
  `;

    const agentsRunOrm: AgentRunEntityOrm[] =
      await this.dataSource.query(query);

    if (agentsRunOrm.length === 0) return [];

    return agentsRunOrm.map((item) =>
      AgentRunMapper.toDomain({ agentRunOrm: item }),
    );
  }

  public async save(payload: AgentRunEntity): Promise<void> {
    const agentRunMapped = AgentRunMapper.toOrm({
      agentRun: payload,
    });
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(AgentRunEntityOrm).save(agentRunMapped);
      await this.internalAgentJobComposition.save(
        payload.internalJobs,
        manager,
      );
      await this.outboxRepository.save(payload.domainEvents, manager);
    });
  }
}
