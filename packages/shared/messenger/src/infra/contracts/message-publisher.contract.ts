export type MessageSendBatchInput = {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string;
}[];

export abstract class MessagePublisherContract {
  abstract publishBatch(outbox: MessageSendBatchInput): Promise<void>;
}
