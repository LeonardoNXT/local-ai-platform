import { Kafka, type KafkaConfig, Partitioners, type Producer } from "kafkajs";
import { type EventPublisher } from "../contracts/message-broker.contract";
import { type MessageSendBatchInput } from "../contracts/message-publisher.contract";
import { OutboxMapper } from "../outbox/outbox.mapper";

export class KafkaInitializer implements EventPublisher {
  private readonly kafka: Kafka;
  private producer?: Producer;
  private constructor(config: KafkaConfig) {
    this.kafka = new Kafka(config);
  }

  public static create(config: KafkaConfig): KafkaInitializer {
    return new KafkaInitializer(config);
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

  async producerInitializer(): Promise<void> {
    // precisa ser inicializado para funcionar.
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    this.producer = producer;
  }
}
