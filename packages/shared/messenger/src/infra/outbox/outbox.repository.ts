import { type DataSource, type EntityManager } from "typeorm";
import { OutboxOrmEntity } from "./oubox.entity";
import { CONSUME_UNPROCESSED } from "../queries/consume-unprocessed";
import { MARK_AS_PUBLISHED } from "../queries/mark-as-published";
import { type OutboxType } from "../dtos/outbox.dto";
import { type DomainEventModel } from "../dtos/domain-events.dto";
import { OutboxMapper } from "./outbox.mapper";
import { type OutboxPort } from "./outbox.port";

type ReturnOfSkipLocked<T> = [T[], number];

export class TypeOrmOutboxRepository implements OutboxPort {
  private readonly appDataSource: DataSource;
  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource;
  }

  public static create(appDataSource: DataSource): TypeOrmOutboxRepository {
    return new TypeOrmOutboxRepository(appDataSource);
  }

  public async save<
    AggregateType extends string,
    EventType extends string,
    Payload,
  >(
    events: DomainEventModel<AggregateType, EventType, Payload>[],
    manager: EntityManager,
  ): Promise<void> {
    for (const event of events) {
      const outbox = manager.create(OutboxOrmEntity, {
        id: event.eventId,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        eventType: event.eventType,
        payload: event.payload,
        published: false,
        retry_count: 0,
        next_attempt_at: new Date(),
        occurredAt: new Date(),
      });
      await manager.save(outbox);
    }
  }

  public async consumeUnprocessed(limit: number): Promise<OutboxType[]> {
    return await this.appDataSource.transaction(async (manager) => {
      const query: ReturnOfSkipLocked<OutboxType> = await manager.query(
        CONSUME_UNPROCESSED,
        [limit],
      );

      const result: OutboxType[] = query[0];

      return result;
    });
  }

  public async markAsPublished(events: OutboxType[]): Promise<void> {
    const eventsIds = OutboxMapper.toIds(events);
    await this.appDataSource.transaction(async (manager) => {
      await manager.query(MARK_AS_PUBLISHED, [new Date(), eventsIds]);
    });
  }
}
