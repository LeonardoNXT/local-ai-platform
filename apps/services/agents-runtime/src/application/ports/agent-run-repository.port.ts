import type AgentRunEntity from "../../domain/entities/agent-run/agent-run.entity.ts";

export default abstract class AgentRunRepositoryPort {
  abstract save(payload: AgentRunEntity): Promise<void>;
  abstract findPending(): Promise<AgentRunEntity[]>;
  abstract delete(payload: { id: string }): Promise<void>;
}
