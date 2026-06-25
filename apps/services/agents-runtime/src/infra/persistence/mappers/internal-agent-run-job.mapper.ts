import { InternalAgentRunJobOrmEntity } from "../entities/internal-agent-run-job-orm.entity.ts";
import type { InternalAgentRunJob } from "../../../domain/types/internal-job.types.ts";

export abstract class InternalAgentRunJobMapper {
  public static toOrm(payload: {
    internalAgentRunJob: InternalAgentRunJob;
  }): InternalAgentRunJobOrmEntity {
    const orm = new InternalAgentRunJobOrmEntity();

    orm.attempts = payload.internalAgentRunJob.attempts;
    orm.availableAt = payload.internalAgentRunJob.availableAt;
    orm.createdAt = payload.internalAgentRunJob.createdAt;
    orm.id = payload.internalAgentRunJob.id;
    orm.maxAttempts = payload.internalAgentRunJob.maxAttempts;
    orm.runId = payload.internalAgentRunJob.runId;
    orm.status = payload.internalAgentRunJob.status;
    orm.type = payload.internalAgentRunJob.type;
    orm.updatedAt = payload.internalAgentRunJob.updatedAt;

    if (payload.internalAgentRunJob.lastError) {
      orm.lastError = payload.internalAgentRunJob.lastError;
    }

    return orm;
  }

  public toDomain(payload: {
    internalAgentRunJobOrmEntity: InternalAgentRunJobOrmEntity;
  }): InternalAgentRunJob {
    const internalAgentRunJob: InternalAgentRunJob = {
      attempts: payload.internalAgentRunJobOrmEntity.attempts,
      availableAt: payload.internalAgentRunJobOrmEntity.availableAt,
      createdAt: payload.internalAgentRunJobOrmEntity.createdAt,
      id: payload.internalAgentRunJobOrmEntity.id,
      maxAttempts: payload.internalAgentRunJobOrmEntity.maxAttempts,
      runId: payload.internalAgentRunJobOrmEntity.runId,
      status: payload.internalAgentRunJobOrmEntity.status,
      type: payload.internalAgentRunJobOrmEntity.type,
      updatedAt: payload.internalAgentRunJobOrmEntity.updatedAt,
    };

    if (payload.internalAgentRunJobOrmEntity.lastError) {
      internalAgentRunJob.lastError =
        payload.internalAgentRunJobOrmEntity.lastError;
    }

    return internalAgentRunJob;
  }
}
