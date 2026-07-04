import AgentRunEntity from "../../../domain/entities/agent-run/agent-run.entity.ts";
import AgentRunEntityOrm from "../entities/agent-run-orm.entity.ts";

export default class AgentRunMapper {
  public static toOrm(payload: AgentRunEntity): AgentRunEntityOrm {
    const orm = new AgentRunEntityOrm();

    orm.agentRunInputId = payload.agentRunInputId;
    orm.agentRunOutputId = payload.agentRunOutputId;
    orm.createdAt = payload.createdAt;
    orm.currentStepId = payload.currentStepId;
    orm.currentStepIndex = payload.currentStepIndex;
    orm.id = payload.id;
    orm.planId = payload.planId;
    orm.planningId = payload.planningId;
    orm.status = payload.status;
    orm.updatedAt = payload.updatedAt;
    orm.userId = payload.userId;

    return orm;
  }

  public static toDomain(payload: AgentRunEntityOrm): AgentRunEntity {
    return AgentRunEntity.restore({
      agent_run_input_id: payload.agentRunInputId,
      created_at: payload.createdAt,
      current_step_index: payload.currentStepIndex,
      id: payload.id,
      status: payload.status,
      updated_at: payload.updatedAt,
      user_id: payload.userId,
      agent_run_output_id: payload.agentRunOutputId,
      current_step_id: payload.currentStepId,
      plan_id: payload.planId,
      planning_id: payload.planningId,
    });
  }
}
