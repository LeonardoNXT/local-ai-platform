export type EventType =
  | "create"
  | "status"
  | "llm.model"
  | "plan"
  | "artifacts"
  | "failed"
  | "cancelled";

export interface EventPayload {
  userId: string;
  id: string;
}

export interface DomainEventType {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: "agents";
  eventType: EventType;
  payload: EventPayload;
}
