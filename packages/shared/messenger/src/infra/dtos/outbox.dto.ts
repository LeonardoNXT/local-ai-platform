export type OutboxType = {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: string;
  occurredAt: Date;
  published: boolean;
  processing: boolean;
  processing_started_at: Date;
  publishedAt?: Date;
  retry_count: number;
  next_attempt_at?: Date;
};
