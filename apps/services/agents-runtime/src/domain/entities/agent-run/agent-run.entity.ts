export type AgentRunEntityProps = {
  id: string;
  status: Status;
  userId: string;
  stepsCount: number;
  llmModel: LLMModel;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
};

export class AgentRunEntity {}
