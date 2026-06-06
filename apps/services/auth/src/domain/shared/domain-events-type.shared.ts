export type EventType = "created" | "revoked" | "rotated";
export type EventPayload = {
  userId: string;
  refreshTokenId: string;
};

export interface DomainEventType {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: "auth";
  eventType: EventType;
  payload: EventPayload;
}
