import type { OutboxType } from "@local-ai/shared-messenger";
import { type DomainEvent } from "../../../domain/shared/domain-event";
import { type EntityManager } from "typeorm";

export interface OutboxRepositoryLocal {
  save(events: DomainEvent[], manager: EntityManager): Promise<void>;
  consumeUnprocessed(limit: number): Promise<OutboxType[]>;
  markAsPublished(events: OutboxType[]): Promise<void>;
}
