import type {
  DomainEventType,
  EventPayload,
  EventType,
} from "../shared/domain-events-type.shared";

type ConstructorPayload = {
  aggregateId: string;
  eventType: EventType;
  payload: EventPayload;
};

export class BaseDomainEvents implements DomainEventType {
  public readonly aggregateId: string;
  public readonly eventType: EventType;
  public readonly payload: EventPayload;
  public readonly aggregateType = "auth";
  public readonly occurredAt: Date = new Date();
  public readonly eventId: string = crypto.randomUUID();

  private constructor({ aggregateId, eventType, payload }: ConstructorPayload) {
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.payload = payload;
  }

  public static create({
    aggregateId,
    eventType,
    payload,
  }: {
    aggregateId: string;
    eventType: EventType;
    payload: EventPayload;
  }): DomainEventType {
    return new BaseDomainEvents({
      aggregateId,
      eventType,
      payload: payload,
    });
  }
}
