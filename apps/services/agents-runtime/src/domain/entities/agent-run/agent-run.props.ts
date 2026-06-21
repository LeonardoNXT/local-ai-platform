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

  selectedModel: {
    provider: LLMProvider;
    llm: LLMModel;
    intelligence: LLMIntelligence;
  };

  routedBy: "local" | "system";

  routingReason: string;

  status: "pending" | "running" | "completed" | "failed";
};

export type Step = {
  id: string;
  index: number;

  objective: string;
  summary: string;

  kind:
    | "model_call"
    | "tool_call"
    | "memory_search"
    | "knowledge_search"
    | "subrun"
    | "final_assembly";

  modelPreference?: {
    provider?: LLMProvider;
    intelligence?: LLMIntelligence;
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
  status: Status;
  userId: string;

  planning: AgentRunPlanning | null;

  plan: AgentRunPlan | null;

  currentStepIndex: number;

  artifacts: AgentRunArtifact[];

  createdAt: string;
  updatedAt: string;
};
export type AgentRunEntityCreateMethodProps = {
  userId: string;

  createdAt: string;

  updatedAt: string;
};

export type AgentRunEntityStarterMethodProps = {
  stepsCount: number;

  plan: AgentRunPlan;

  llmModel: LLMModel;

  updatedAt: string;
};
