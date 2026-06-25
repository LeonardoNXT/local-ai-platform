import AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import { AgentRunEntityOrm } from "../entities/agent-run-orm.entity.ts";

export default abstract class AgentRunMapper {
  public static toOrm(payload: {
    agentRun: AgentRunEntity;
  }): AgentRunEntityOrm {
    const orm = new AgentRunEntityOrm();

    orm.artifacts = payload.agentRun.artifacts;
    orm.createdAt = payload.agentRun.createdAt;
    orm.currentStepIndex = payload.agentRun.currentStepIndex;
    orm.id = payload.agentRun.id;
    orm.plan = payload.agentRun.plan;
    orm.planning = payload.agentRun.planning;
    orm.status = payload.agentRun.status;
    orm.updatedAt = payload.agentRun.updatedAt;
    orm.userId = payload.agentRun.userId;

    return orm;
  }

  public static toDomain(payload: {
    agentRunOrm: AgentRunEntityOrm;
  }): AgentRunEntity {
    return AgentRunEntity.recreate({
      artifacts: payload.agentRunOrm.artifacts,
      createdAt: payload.agentRunOrm.createdAt,
      currentStepIndex: payload.agentRunOrm.currentStepIndex,
      id: payload.agentRunOrm.id,
      plan: payload.agentRunOrm.plan,
      planning: payload.agentRunOrm.planning,
      status: payload.agentRunOrm.status,
      updatedAt: payload.agentRunOrm.updatedAt,
      userId: payload.agentRunOrm.userId,
    });
  }
}
