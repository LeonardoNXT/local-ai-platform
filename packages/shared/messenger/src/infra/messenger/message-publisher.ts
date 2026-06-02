import { type EventPublisher } from "../contracts/message-broker.contract";
import {
  type MessagePublisherContract,
  type MessageSendBatchInput,
} from "../contracts/message-publisher.contract";

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
