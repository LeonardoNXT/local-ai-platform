export type EventType = keyof AgentEventPayloadMap;

export type BaseEventPayload = Record<string, unknown> & {
  userId: string;
  id: string;
};

export type AgentEventPayloadMap = {
  created: BaseEventPayload & {
    status: "pending";
  };

  status_changed: BaseEventPayload & {
    previousStatus: string;
    currentStatus: string;
  };

  planning_started: BaseEventPayload & {
    planningStatus: "running";
  };

  planning_failed: BaseEventPayload & {
    reason: string;
  };

  model_selected: BaseEventPayload & {
    provider: string;
    llm: string;
    intelligence: "low" | "medium" | "high";
    routingReason: string;
  };

  plan_attached: BaseEventPayload & {
    summary: string;
    stepsCount: number;
  };

  step_started: BaseEventPayload & {
    stepId: string;
    stepIndex: number;
    objective: string;
  };

  step_completed: BaseEventPayload & {
    stepId: string;
    stepIndex: number;
  };

  artifact_created: BaseEventPayload & {
    artifactId: string;
    artifactType: string;
    stepId?: string;
    stepIndex?: number;
  };

  completed: BaseEventPayload & {
    completedAt: string;
  };

  failed: BaseEventPayload & {
    reason: string;
  };

  canceled: BaseEventPayload & {
    reason?: string;
  };
};

export type DomainEventType<TEventType extends EventType = EventType> = {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: "agents";
  eventType: TEventType;
  payload: AgentEventPayloadMap[TEventType];
};

export type AgentDomainEvent = {
  [TEventType in EventType]: DomainEventType<TEventType>;
}[EventType];
