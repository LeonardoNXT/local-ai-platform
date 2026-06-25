import { InternalAgentRunJobMapper } from "../mappers/internal-agent-run-job.mapper.ts";
import type { InternalAgentRunJob } from "../../../domain/types/internal-job.types.ts";
import { InternalAgentRunJobOrmEntity } from "../entities/internal-agent-run-job-orm.entity.ts";
import type { EntityManager } from "typeorm";

export default class InternalAgentJobComposition {
  public async save(
    payload: InternalAgentRunJob[],
    manager: EntityManager,
  ): Promise<void> {
    const entities: InternalAgentRunJobOrmEntity[] = payload.map((item) =>
      InternalAgentRunJobMapper.toOrm({ internalAgentRunJob: item }),
    );

    const repository = manager.getRepository(InternalAgentRunJobOrmEntity);
    await repository.save(entities);
  }
}
