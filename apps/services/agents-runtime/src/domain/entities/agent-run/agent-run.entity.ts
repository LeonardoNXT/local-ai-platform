import { AggregateRoot } from "../../shared/aggregate-root.ts";
import type {
  AgentRunArtifact,
  AgentRunEntityCreateMethodProps,
  AgentRunEntityProps,
  AgentRunPlan,
  AgentRunPlanning,
  Status,
} from "./agent-run.props.ts";

type StartPlanningPayload = {
  planning: AgentRunPlanning;
  updatedAt: string;
};

type AttachPlanPayload = {
  plan: AgentRunPlan;
  updatedAt: string;
};

type AddArtifactPayload = {
  artifact: AgentRunArtifact;
  updatedAt: string;
};

type UpdateStatusPayload = {
  status: Status;
  updatedAt: string;
};

export default class AgentRunEntity extends AggregateRoot {
  private readonly content: AgentRunEntityProps;

  private constructor(content: AgentRunEntityProps) {
    super();
    this.content = content;
  }

  public static create(
    id: string,
    eventId: string,
    content: AgentRunEntityCreateMethodProps,
    internaljob: {
      jobId: string;
      availableAt: string;
    },
  ): AgentRunEntity {
    const agentRunEntity = new AgentRunEntity({
      id,
      userId: content.userId,
      status: "pending",
      planning: null,
      plan: null,
      currentStepIndex: 0,
      artifacts: [],
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    });

    agentRunEntity.addDomainEvent({
      aggregateId: agentRunEntity.id,
      aggregateType: "agents",
      eventId: eventId,
      eventType: "created",
      occurredAt: new Date(agentRunEntity.createdAt),
      payload: {
        id: agentRunEntity.id,
        userId: agentRunEntity.userId,
        status: agentRunEntity.status,
      },
    });

    agentRunEntity.addInternalJob({
      id: internaljob.jobId,
      runId: agentRunEntity.id,
      attempts: 0,
      availableAt: internaljob.availableAt,
      createdAt: content.createdAt,
      maxAttempts: 5,
      status: "pending",
      type: "generate_plan",
      updatedAt: content.updatedAt,
    });

    return agentRunEntity;
  }

  public static recreate(payload: AgentRunEntityProps): AgentRunEntity {
    return new AgentRunEntity({
      id: payload.id,
      userId: payload.userId,

      status: payload.status,

      planning: payload.planning,
      plan: payload.plan,

      currentStepIndex: payload.currentStepIndex,

      artifacts: [...payload.artifacts],

      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    });
  }

  public startPlanning(payload: StartPlanningPayload): AgentRunEntity {
    if (this.content.status !== "pending") {
      throw new Error("AgentRun must be pending to start planning.");
    }

    return new AgentRunEntity({
      ...this.content,

      status: "planning",

      planning: {
        ...payload.planning,
        status: "running",
      },

      updatedAt: payload.updatedAt,
    });
  }

  public attachPlan(payload: AttachPlanPayload): AgentRunEntity {
    if (this.content.status !== "planning") {
      throw new Error("AgentRun must be planning to attach a plan.");
    }

    if (!this.content.planning) {
      throw new Error(
        "AgentRun planning metadata is required before attaching a plan.",
      );
    }

    return new AgentRunEntity({
      ...this.content,

      status: "running",

      planning: {
        ...this.content.planning,
        status: "completed",
      },

      plan: payload.plan,
      currentStepIndex: 0,

      updatedAt: payload.updatedAt,
    });
  }

  public failPlanning(payload: { updatedAt: string }): AgentRunEntity {
    if (!this.content.planning) {
      throw new Error(
        "AgentRun planning metadata is required to fail planning.",
      );
    }

    return new AgentRunEntity({
      ...this.content,

      status: "failed",

      planning: {
        ...this.content.planning,
        status: "failed",
      },

      updatedAt: payload.updatedAt,
    });
  }

  public addArtifact(payload: AddArtifactPayload): AgentRunEntity {
    return new AgentRunEntity({
      ...this.content,

      artifacts: [...this.content.artifacts, payload.artifact],

      updatedAt: payload.updatedAt,
    });
  }

  public updateStatus(payload: UpdateStatusPayload): AgentRunEntity {
    return new AgentRunEntity({
      ...this.content,

      status: payload.status,

      updatedAt: payload.updatedAt,
    });
  }

  public moveToNextStep(payload: { updatedAt: string }): AgentRunEntity {
    if (!this.content.plan) {
      throw new Error("AgentRun plan is required to move to next step.");
    }

    const nextStepIndex = this.content.currentStepIndex + 1;

    if (nextStepIndex >= this.content.plan.steps.length) {
      return new AgentRunEntity({
        ...this.content,

        status: "completed",

        updatedAt: payload.updatedAt,
      });
    }

    return new AgentRunEntity({
      ...this.content,

      currentStepIndex: nextStepIndex,

      updatedAt: payload.updatedAt,
    });
  }

  public get id(): string {
    return this.content.id;
  }

  public get userId(): string {
    return this.content.userId;
  }

  public get status(): Status {
    return this.content.status;
  }

  public get planning(): AgentRunPlanning | null {
    return this.content.planning;
  }

  public get plan(): AgentRunPlan | null {
    return this.content.plan;
  }

  public get currentStepIndex(): number {
    return this.content.currentStepIndex;
  }

  public get stepsCount(): number {
    return this.content.plan?.steps.length ?? 0;
  }

  public get artifacts(): AgentRunArtifact[] {
    return [...this.content.artifacts];
  }

  public get createdAt(): string {
    return this.content.createdAt;
  }

  public get updatedAt(): string {
    return this.content.updatedAt;
  }
}
