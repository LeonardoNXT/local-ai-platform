export type Step = {
  id: string;
  objective: string;
  summary: string;
  step: number;
  llmModel: string;
};

export type LLMModel = "local" | "claude" | "openai" | "gemini";
export type Status =
  | "pending"
  | "planning"
  | "running"
  | "waiting_confirmation"
  | "deferred"
  | "completed"
  | "failed"
  | "canceled";

export type AgentRunPlan = {
  summary: string;
  limitations: string;
  steps: Step[];
};

export type AgentRunArtifacts = {
  id: string;
  llmModel: LLMModel;
  stepIndex: string;
  content: string;
};

export type AgentRunEntityProps = {
  id: string;
  status: Status;
  userId: string;
  stepsCount: number;
  llmModel: LLMModel;
  plan: AgentRunPlan;
  currentStepIndex: number;
  artifacts: string[];
  createdAt: string;
  updatedAt: string;
};
