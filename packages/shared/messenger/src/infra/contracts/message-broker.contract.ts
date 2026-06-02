import { type MessageSendBatchInput } from "./message-publisher.contract";

type MessageType = { key: string; value: string };
export type TopicMessages = { topic: string; messages: MessageType[] }[];

export interface EventPublisher {
  sendBatch(input: MessageSendBatchInput): Promise<void>;
}
