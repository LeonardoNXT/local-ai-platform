export type AgentsRuntimePayload = {
  userId: string;
  id: string;
};

export enum AgentsTopics {
  CREATED = "agents.created",
  STATUS = "agents.status",
  PLANNING = "agents.planning",
  MODEL = "agents.model",
  PLAN = "agents.plan",
  STEP = "agents.step",
  ARTIFACT = "agents.artifact",
  COMPLETED = "agents.completed",
  FAILED = "agents.failed",
  CANCELED = "agents.canceled",
}
