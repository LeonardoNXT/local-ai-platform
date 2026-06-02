export interface DomainEventModel<
  AggregateType extends string,
  EventType extends string,
  Payload,
> {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: AggregateType;
  eventType: EventType;
  payload: Record<string, Payload>;
}
