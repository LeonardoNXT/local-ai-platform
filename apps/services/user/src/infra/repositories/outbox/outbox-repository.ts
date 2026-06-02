import { type DataSource, type EntityManager } from "typeorm";
import { OutboxOrmEntity } from "../../database/entities/outbox.orm-entity";
import {
  CONSUME_UNPROCESSED,
  MARK_AS_PUBLISHED,
  OutboxMapper,
} from "@local-ai/shared-messenger";
import { type OutboxType } from "@local-ai/shared-messenger";
import { type DomainEvent } from "../../../domain/shared/domain-event";
import { type OutboxRepositoryLocal } from "./outbox-contract";

type ReturnOfSkipLocked<T> = [T[], number];

export class TypeOrmOutboxRepository implements OutboxRepositoryLocal {
  private readonly appDataSource: DataSource;
  constructor(appDataSource: DataSource) {
    this.appDataSource = appDataSource;
  }

  public static create(appDataSource: DataSource): TypeOrmOutboxRepository {
    return new TypeOrmOutboxRepository(appDataSource);
  }

  public async save(
    events: DomainEvent[],
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
