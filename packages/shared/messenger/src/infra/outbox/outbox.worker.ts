import { type MessagePublisherContract } from "../contracts/message-publisher.contract";
import { type OutboxPort } from "./outbox.port";

export class OutboxWorker {
  private readonly messagePublisher: MessagePublisherContract;
  private readonly outboxRepository: OutboxPort;
  private isRunning = false;

  private constructor(
    messagePublisher: MessagePublisherContract,
    outboxRepository: OutboxPort,
  ) {
    this.messagePublisher = messagePublisher;
    this.outboxRepository = outboxRepository;
  }

  public static create(
    messagePublisher: MessagePublisherContract,
    outboxRepository: OutboxPort,
  ): OutboxWorker {
    return new OutboxWorker(messagePublisher, outboxRepository);
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    console.log("OUTBOX WORKER IS RUNING");
    while (this.isRunning) {
      const start = Date.now();
      try {
        const events = await this.outboxRepository.consumeUnprocessed(100);

        if (!events?.length || events.length === 0) {
          await this.sleep(2000);
          continue;
        }
        await this.messagePublisher.publishBatch(events);
        await this.outboxRepository.markAsPublished(events);

        console.log({
          location: "OUTBOX-WORKER",
          delay: Date.now() - start + "ms",
        });
      } catch (err) {
        console.error({
          name: "OUTBOX-WORKER-ERROR",
          error: err,
        });
        await this.sleep(1000);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public stop(): void {
    this.isRunning = false;
  }
}
