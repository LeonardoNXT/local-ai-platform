import { Kafka, type KafkaConfig, Partitioners, type Producer } from "kafkajs";
import { type EventPublisher } from "@local-ai/shared-messenger";
import { OutboxMapper } from "@local-ai/shared-messenger";
import { type MessageSendBatchInput } from "@local-ai/shared-messenger";

const config = {
  clientId: "user-service",
  brokers: ["localhost:29092"],
} as KafkaConfig;

export class KafkaInitializer implements EventPublisher {
  private readonly kafka: Kafka;
  private producer: Producer;
  private constructor() {
    this.kafka = new Kafka(config);
  }

  public static create(): KafkaInitializer {
    return new KafkaInitializer();
  }

  async sendBatch(outbox: MessageSendBatchInput): Promise<void> {
    const topicMessages = OutboxMapper.toKafkaBatch(outbox);

    await this.producer.sendBatch({
      topicMessages: topicMessages,
    });
  }

  async producerInitializer(): Promise<void> {
    // precisa ser inicializado para funcionar.
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    await producer.connect();
    this.producer = producer;
  }
}
