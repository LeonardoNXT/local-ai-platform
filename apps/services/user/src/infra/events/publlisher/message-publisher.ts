import { type EventPublisher } from "@local-ai/shared-messenger";
import {
  type MessagePublisherContract,
  type MessageSendBatchInput,
} from "@local-ai/shared-messenger";

export class MessagePublisher implements MessagePublisherContract {
  private readonly eventPublisher: EventPublisher;

  private constructor(eventPublisher: EventPublisher) {
    this.eventPublisher = eventPublisher;
  }

  public static create(eventPublisher: EventPublisher): MessagePublisher {
    return new MessagePublisher(eventPublisher);
  }

  public async publishBatch(outbox: MessageSendBatchInput): Promise<void> {
    await this.eventPublisher.sendBatch(outbox);
  }
}
