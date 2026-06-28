import type {
  StepKind,
  LLMIntelligence,
  LLMProvider,
} from "../entities/agent-run/agent-run.props.ts";

export const LLM_PROVIDER: LLMProvider[] = [
  "anthropic",
  "gemini",
  "local",
  "openai",
];

export const LLM_INTELLIGENCE: LLMIntelligence[] = ["high", "low", "medium"];

export const STEP_KIND_LIST: StepKind[] = [
  "final_assembly",
  "knowledge_search",
  "memory_search",
  "model_call",
  "subrun",
  "tool_call",
];
