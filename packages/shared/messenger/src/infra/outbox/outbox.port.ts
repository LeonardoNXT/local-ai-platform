import { type EntityManager } from "typeorm";
import { type DomainEventModel } from "../dtos/domain-events.dto";
import { type OutboxType } from "../dtos/outbox.dto";

export abstract class OutboxPort {
  abstract save: <
    AggregateType extends string,
    EventType extends string,
    Payload,
  >(
    events: DomainEventModel<AggregateType, EventType, Payload>[],
    manager: EntityManager,
  ) => Promise<void>;
  abstract consumeUnprocessed: (limit: number) => Promise<OutboxType[]>;
  abstract markAsPublished: (events: OutboxType[]) => Promise<void>;
}
