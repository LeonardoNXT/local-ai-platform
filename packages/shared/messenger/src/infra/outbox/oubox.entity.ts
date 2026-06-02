import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("outbox")
export class OutboxOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  aggregateId!: string;

  @Column()
  aggregateType!: string;

  @Column()
  eventType!: string;

  @Column("jsonb")
  payload!: Record<string, unknown>;

  @Column()
  occurredAt!: Date;

  @Column({ default: false })
  published!: boolean;

  @Column({ name: "published_at", type: "timestamp", nullable: true })
  publishedAt!: Date;

  @Column({ default: false })
  processing!: boolean;

  @Column({ nullable: true, type: "timestamp" })
  processing_started_at?: Date;

  @Column({ default: 0 })
  retry_count!: number;

  @Column({ type: "timestamp", nullable: true })
  next_attempt_at!: Date;
}
