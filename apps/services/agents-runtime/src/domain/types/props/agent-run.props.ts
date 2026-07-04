export type LLMProvider = "local" | "gemini" | "openai" | "anthropic";

export type LLMModel =
  | "qwen2.5:7b"
  | "llama3.1:8b"
  | "gemini-flash"
  | "gemini-pro"
  | "gpt-5"
  | "gpt-4"
  | "claude-sonnet";

export type LLMIntelligence = "low" | "medium" | "high";

export type Status =
  | "pending"
  | "planning"
  | "planned"
  | "running"
  | "waiting_confirmation"
  | "deferred"
  | "completed"
  | "failed"
  | "canceled";

export type PlanningInputFeatureKind =
  | "confidential"
  | "mathematics"
  | "code"
  | "high_output"
  | "creative"
  | "geographic"
  | "technical"
  | "large_context"
  | "requires_strict_json"
  | "policy_sensitive";

export type PlanningInputFeature = {
  kind: PlanningInputFeatureKind;
  importance: number;
  reason: string;
};

export type PlanningRouteConstraints = {
  cloudAllowed: boolean;
  requiresLocal: boolean;
  requiresHumanReview: boolean;
  reason?: string;
};

export type PlanningRouteAnalysis = {
  features: PlanningInputFeature[];
  constraints: PlanningRouteConstraints;
  estimatedInputTokens: number;
  estimatedOutputTokens?: number;
};

export type LLMModelProfile = {
  provider: LLMProvider;
  llm: LLMModel;
  intelligence: LLMIntelligence;

  maxInputTokens: number;

  strengths: PlanningInputFeatureKind[];

  supportsStrictJson: boolean;

  costWeight: number;
  speedWeight: number;
  qualityWeight: number;
  privacyWeight: number;
};

export type AgentRunPlanning = {
  analysis: PlanningRouteAnalysis;

  R: {
    provider: LLMProvider;
    llm: LLMModel;
    intelligence: LLMIntelligence;
  };

  routedBy: "local" | "system";

  routingReason: string;

  status: "pending" | "running" | "completed" | "failed";
};

export type StepKind =
  | "model_call"
  | "tool_call"
  | "memory_search"
  | "knowledge_search"
  | "subrun"
  | "final_assembly";

export type Step = {
  id: string;
  index: number;

  objective: string;
  summary: string;

  kind: StepKind;

  modelPreference?: {
    provider?: LLMProvider[];
    intelligence?: LLMIntelligence;
    allowFallback: boolean;
  };

  inputKeys: string[];
  outputKey: string;
};

export type AgentRunPlan = {
  summary: string;
  limitations?: string;
  steps: Step[];
};

export type AgentRunArtifact = {
  id: string;
  stepId?: string;
  stepIndex?: number;

  key: string;

  type: "text" | "json" | "html" | "tool_result" | "draft" | "final_output";

  content: unknown;

  model?: {
    provider: LLMProvider;
    llm: LLMModel;
  };

  createdAt: string;
};

export type AgentRunEntityProps = {
  id: string;
  user_id: string;
  agent_run_input_id: string;
  agent_run_output_id?: string;
  plan_id?: string;
  planning_id?: string;
  current_step_id?: string;
  current_step_index: number;
  status: Status;
  created_at: string;
  updated_at: string;
};

export type AgentRunEntityCreateMethodProps = {
  user_id: string;
  agent_run_input_id: string;
  created_at: string;
  updated_at: string;
};

export type AgentRunEntityStarterMethodProps = {
  stepsCount: number;

  plan: AgentRunPlan;

  llmModel: LLMModel;

  updatedAt: string;
};
