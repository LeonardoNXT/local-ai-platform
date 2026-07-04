import AgentRunError from "../../errors/entity-errors/agent-run.error.ts";
import { AggregateRoot } from "../../shared/aggregate-root.ts";
import type {
  AgentRunEntityCreateMethodProps,
  AgentRunEntityProps,
  Status,
} from "../../types/props/agent-run.props.ts";

export default class AgentRunEntity extends AggregateRoot {
  private readonly content: AgentRunEntityProps;

  private constructor(payload: AgentRunEntityProps) {
    super();
    this.content = payload;
  }

  public static create(
    payload: Omit<AgentRunEntityCreateMethodProps, "id"> & {
      eventId: string;
      entityId: string;
      event_occurred_at: Date;
      job_available_at: string;
      jobId: string;
    },
  ): AgentRunEntity {
    const entity = new AgentRunEntity({
      id: payload.entityId,
      user_id: payload.user_id,
      agent_run_input_id: payload.agent_run_input_id,
      current_step_index: 0,
      status: "pending",
      created_at: payload.created_at,
      updated_at: payload.updated_at,
    });

    entity.addInternalJob({
      id: payload.jobId,
      attempts: 1,
      maxAttempts: 10,
      runId: entity.id,
      status: "pending",
      type: "generate_plan",
      updatedAt: payload.job_available_at,
      availableAt: payload.job_available_at,
      createdAt: payload.created_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.eventId,
      eventType: "created",
      occurredAt: payload.event_occurred_at,
      payload: {
        status: "pending",
        id: entity.id,
        userId: entity.userId,
      },
    });

    return entity;
  }

  public static restore(payload: AgentRunEntityProps) {
    return new AgentRunEntity(payload);
  }

  public planning(payload: {
    planning_id: string;
    event_id: string;
    updated_at: string;
    event_occurred_at: Date;
  }): AgentRunEntity {
    const entity = new AgentRunEntity({
      ...this.content,
      status: "planning",
      planning_id: payload.planning_id,
      updated_at: payload.updated_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.event_id,
      eventType: "planning_started",
      occurredAt: payload.event_occurred_at,
      payload: {
        userId: entity.userId,
        id: entity.id,
        planningStatus: "running",
      },
    });

    return entity;
  }

  public planned(payload: {
    plan_id: string;
    event_id: string;
    plan_summary: string;
    stepsCount: string;
    updated_at: string;
    event_occurred_at: Date;
  }): AgentRunEntity {
    if (!this.planningId) {
      throw new AgentRunError({
        message:
          "In order to plan the Agent Run, the 'planning_id' must be a UUID string. Please set planning_id beforehand",
        cause: "The planning_id doesn't exists.",
      });
    }

    const entity = new AgentRunEntity({
      ...this.content,
      status: "planned",
      plan_id: payload.plan_id,
      updated_at: payload.updated_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.event_id,
      eventType: "plan_attached",
      occurredAt: payload.event_occurred_at,
      payload: {
        userId: entity.userId,
        id: entity.id,
        summary: payload.plan_summary,
        stepsCount: payload.stepsCount,
      },
    });

    return entity;
  }

  public startSteps(payload: {
    event_id: string;
    updated_at: string;
    current_step_id: string;
    current_step_index: number;
    current_step_objective: string;
    event_occurred_at: Date;
  }): AgentRunEntity {
    if (
      !this.content.planning_id ||
      !this.content.plan_id ||
      this.content.current_step_id ||
      this.content.current_step_index !== 0
    ) {
      throw new AgentRunError({
        message:
          "In order to start step, all required properties is needed to make this action. Please, fill all required properties beforehand.",
        cause:
          "The entity is missing required properties needed to go foward. Required Properties: [planning_id, plan_id, current_step_id === null, current_step_index === 0]",
      });
    }

    if (
      typeof payload.current_step_index !== "number" ||
      !Number.isInteger(payload.current_step_index) ||
      payload.current_step_index < 0
    ) {
      throw new AgentRunError({
        message:
          "current_step_index has a wrong type. Please, change the current_step_index type to a number >= 0.",
        cause: `Bad type of the current_step_index. [ type: ${typeof payload.current_step_objective} ] `,
      });
    }

    const entity = new AgentRunEntity({
      ...this.content,
      status: "running",
      current_step_id: payload.current_step_id,
      current_step_index: payload.current_step_index,
      updated_at: payload.updated_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.event_id,
      eventType: "step_started",
      occurredAt: payload.event_occurred_at,
      payload: {
        id: entity.id,
        userId: entity.userId,
        stepId: entity.currentStepId,
        stepIndex: entity.currentStepIndex,
        objective: payload.current_step_objective,
      },
    });

    return entity;
  }

  public changeStep(payload: {
    event_id: string;
    updated_at: string;
    current_step_id: string;
    current_step_index: number;
    current_step_objective: number;
    event_occurred_at: Date;
  }): AgentRunEntity {
    if (
      !this.content.planning_id ||
      !this.content.plan_id ||
      !this.content.current_step_id ||
      !this.content.current_step_index
    ) {
      throw new AgentRunError({
        message:
          "In order to go to the next step, all required properties is needed to make this action. Please, fill all required properties beforehand.",
        cause: "The entity is missing required properties needed to go foward.",
      });
    }

    if (
      typeof payload.current_step_index !== "number" ||
      !Number.isInteger(payload.current_step_index) ||
      payload.current_step_index < 0
    ) {
      throw new AgentRunError({
        message:
          "current_step_index has a wrong type. Please, change the current_step_index type to a number >= 0.",
        cause: `Bad type of the current_step_index. [ type: ${typeof payload.current_step_objective} ] `,
      });
    }

    const entity = new AgentRunEntity({
      ...this.content,
      current_step_id: payload.current_step_id,
      current_step_index: payload.current_step_index,
      updated_at: payload.updated_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.event_id,
      eventType: "step_started",
      occurredAt: payload.event_occurred_at,
      payload: {
        id: entity.id,
        userId: entity.userId,
        stepId: entity.currentStepId,
        stepIndex: entity.currentStepIndex,
        objective: payload.current_step_objective,
      },
    });

    return entity;
  }

  public complete(payload: {
    agent_output_id: string;
    event_id: string;
    stepsCount: string;
    updated_at: string;
    event_occurred_at: Date;
  }): AgentRunEntity {
    if (
      !this.content.plan_id ||
      !this.content.planning_id ||
      this.content.current_step_index > 0 ||
      !this.content.current_step_id ||
      this.content.status == "running"
    ) {
      throw new AgentRunError({
        message:
          "In order to complete Agent Run, all required properties must be filled beforehand.",
        cause:
          "The entity is missing required properties needed to complete the AgentRun. Required properties: [plan_id, planning_id, current_step_index > 0, current_step_id, status == 'running'].",
      });
    }

    const entity = new AgentRunEntity({
      ...this.content,
      agent_run_output_id: payload.agent_output_id,
      status: "completed",
      updated_at: payload.updated_at,
    });

    entity.addDomainEvent({
      aggregateId: entity.id,
      aggregateType: "agents",
      eventId: payload.event_id,
      eventType: "completed",
      occurredAt: payload.event_occurred_at,
      payload: {
        userId: entity.userId,
        id: entity.id,
        completedAt: payload.updated_at,
      },
    });

    return entity;
  }

  public get id(): string {
    return this.content.id;
  }

  public get userId(): string {
    return this.content.id;
  }

  public get agentRunInputId(): string {
    return this.content.agent_run_input_id;
  }

  public get agentRunOutputId(): string | undefined {
    return this.content.agent_run_output_id;
  }

  public get planId(): string | undefined {
    return this.content.plan_id;
  }

  public get planningId(): string | undefined {
    return this.content.planning_id;
  }

  public get currentStepId(): string | undefined {
    return this.content.current_step_id;
  }

  public get currentStepIndex(): number {
    return this.content.current_step_index;
  }

  public get status(): Status {
    return this.content.status;
  }

  public get createdAt(): string {
    return this.content.created_at;
  }

  public get updatedAt(): string {
    return this.content.updated_at;
  }
}
