export type MessageSendBatchInput = {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string;
}[];

export interface MessagePublisherContract {
  publishBatch(outbox: MessageSendBatchInput): Promise<void>;
}
