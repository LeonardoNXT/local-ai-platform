import { type EventTypes } from "./event.type.contract";
import { type MessageSendBatchInput } from "./message-publisher.contract";
import { type MessageEnvelop } from "./message-subscriber.contract";

type MessageType = { key: string; value: string };
export type TopicMessages = { topic: string; messages: MessageType[] }[];

export interface EventPublisher {
  sendBatch(input: MessageSendBatchInput): Promise<void>;
  subscriber<T>(
    topic: EventTypes,
    handler: (message: MessageEnvelop<T>) => Promise<void>,
  ): Promise<void>;
}
