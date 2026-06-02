import { type EntityManager } from "typeorm";
import { type DomainEventModel } from "../dtos/domain-events.dto";
import { type OutboxType } from "../dtos/outbox.dto";

export interface OutboxPort {
  save: <AggregateType extends string, EventType extends string, Payload>(
    events: DomainEventModel<AggregateType, EventType, Payload>[],
    manager: EntityManager,
  ) => Promise<void>;
  consumeUnprocessed: (limit: number) => Promise<OutboxType[]>;
  markAsPublished: (events: OutboxType[]) => Promise<void>;
}
