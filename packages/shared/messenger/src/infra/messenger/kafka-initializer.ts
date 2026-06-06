import { Kafka, type KafkaConfig, Partitioners, type Producer } from "kafkajs";
import { type EventPublisher } from "../contracts/message-broker.contract";
import { type MessageSendBatchInput } from "../contracts/message-publisher.contract";
import { OutboxMapper } from "../outbox/outbox.mapper";
import { type EventTypes } from "../contracts/event.type.contract";
import { type MessageEnvelop } from "../contracts/message-subscriber.contract";

export class KafkaInitializer implements EventPublisher {
  private readonly kafka: Kafka;
  private readonly groupId: string;
  private producer?: Producer;
  private constructor(config: KafkaConfig, groupId: string) {
    this.kafka = new Kafka(config);
    this.groupId = groupId;
  }

  public static create(config: KafkaConfig, groupId: string): KafkaInitializer {
    return new KafkaInitializer(config, groupId);
  }

  async sendBatch(outbox: MessageSendBatchInput): Promise<void> {
    const topicMessages = OutboxMapper.toKafkaBatch(outbox);

    if (!this.producer) {
      throw new Error("Kafka producer was not initialized.");
    }

    await this.producer.sendBatch({
      topicMessages: topicMessages,
    });
  }

  public async producerInitializer(): Promise<void> {
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    this.producer = producer;
  }

  public async subscriber<T>(
    topic: EventTypes,
    handler: (message: MessageEnvelop<T>) => Promise<void>,
  ): Promise<void> {
    const consumer = this.kafka.consumer({
      groupId: this.groupId,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) {
          return;
        }

        const payload = JSON.parse(
          message.value.toString(),
        ) as MessageEnvelop<T>;

        await handler(payload);
      },
    });
  }
}
