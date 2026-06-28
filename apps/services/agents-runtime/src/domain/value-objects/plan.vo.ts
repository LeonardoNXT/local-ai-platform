import { type AgentRunPlan } from "../entities/agent-run/agent-run.props.ts";
import {
  LLM_INTELLIGENCE,
  LLM_PROVIDER,
  STEP_KIND_LIST,
} from "../enum/agent-run.enum.ts";
import { PlanVoError } from "../errors/value-objects/plan.vo.error.ts";
import { type ValueObjects } from "../types/value-objects.types.ts";

export class PlanVo implements ValueObjects<AgentRunPlan, AgentRunPlan> {
  private readonly content: AgentRunPlan;

  private constructor(content: AgentRunPlan) {
    this.content = structuredClone(content);
  }

  public static create(payload: AgentRunPlan): PlanVo {
    this.validatePlan(payload);
    return new PlanVo(payload);
  }

  public getValue(): AgentRunPlan {
    return structuredClone(this.content);
  }

  public equals(payload: AgentRunPlan): boolean {
    return JSON.stringify(this.content) === JSON.stringify(payload);
  }

  private static validatePlan(payload: AgentRunPlan): void {
    if (!payload || typeof payload !== "object") {
      throw new PlanVoError({
        message: "Plan must be an object.",
        cause: "Invalid Plan",
      });
    }

    this.validateRequiredString(payload.summary, "summary");

    if (
      payload.limitations !== undefined &&
      payload.limitations !== null &&
      typeof payload.limitations !== "string"
    ) {
      throw new PlanVoError({
        message: "Plan limitations must be a string.",
        cause: "Invalid Plan Limitations",
      });
    }

    if (!Array.isArray(payload.steps) || payload.steps.length === 0) {
      throw new PlanVoError({
        message: "Plan steps must be a non-empty array.",
        cause: "Invalid Plan Steps",
      });
    }

    this.validateUniqueFields(payload);

    payload.steps.forEach((step) => {
      this.validateRequiredString(step.id, "step.id");

      if (!Number.isInteger(step.index) || step.index < 0) {
        throw new PlanVoError({
          message: "Step index must be a positive integer.",
          cause: "Invalid Step Index",
        });
      }

      if (!STEP_KIND_LIST.includes(step.kind)) {
        throw new PlanVoError({
          message: `Invalid step kind: ${step.kind}`,
          cause: "Invalid Step Kind",
        });
      }

      this.validateModelPreference(step.modelPreference);

      this.validateRequiredString(step.objective, "step.objective");
      this.validateRequiredString(step.outputKey, "step.outputKey");
      this.validateRequiredString(step.summary, "step.summary");
    });
  }

  private static validateRequiredString(value: unknown, field: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new PlanVoError({
        message: `${field} must be a non-empty string.`,
        cause: `Invalid ${field}`,
      });
    }
  }

  private static validateModelPreference(
    modelPreference: AgentRunPlan["steps"][number]["modelPreference"],
  ): void {
    if (
      !modelPreference ||
      typeof modelPreference !== "object" ||
      Array.isArray(modelPreference)
    ) {
      throw new PlanVoError({
        message: "Step modelPreference must be an object.",
        cause: "Invalid Model Preference",
      });
    }

    if (
      modelPreference.intelligence !== undefined &&
      !LLM_INTELLIGENCE.includes(modelPreference.intelligence)
    ) {
      throw new PlanVoError({
        message: `Invalid model intelligence: ${modelPreference.intelligence}`,
        cause: "Invalid Model Intelligence",
      });
    }

    if (
      modelPreference.provider !== undefined &&
      !LLM_PROVIDER.includes(modelPreference.provider)
    ) {
      throw new PlanVoError({
        message: `Invalid model provider: ${modelPreference.provider}`,
        cause: "Invalid Model Provider",
      });
    }
  }

  private static validateUniqueFields(payload: AgentRunPlan): void {
    const ids = new Set<string>();
    const indexes = new Set<number>();
    const outputKeys = new Set<string>();

    payload.steps.forEach((step) => {
      if (ids.has(step.id)) {
        throw new PlanVoError({
          message: `Duplicated step id: ${step.id}`,
          cause: "Duplicated Step Id",
        });
      }

      if (indexes.has(step.index)) {
        throw new PlanVoError({
          message: `Duplicated step index: ${step.index}`,
          cause: "Duplicated Step Index",
        });
      }

      if (outputKeys.has(step.outputKey)) {
        throw new PlanVoError({
          message: `Duplicated step outputKey: ${step.outputKey}`,
          cause: "Duplicated Step Output Key",
        });
      }

      ids.add(step.id);
      indexes.add(step.index);
      outputKeys.add(step.outputKey);
    });
  }
}
