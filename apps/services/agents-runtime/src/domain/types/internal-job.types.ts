export interface InternalAgentRunJob {
  id: string;
  runId: string;

  type:
    | "start_planning"
    | "generate_plan"
    | "execute_step"
    | "complete_run"
    | "fail_run";

  status: "pending" | "processing" | "completed" | "failed";

  attempts: number;
  maxAttempts: number;

  availableAt: string;

  lastError?: string;

  createdAt: string;
  updatedAt: string;
}
