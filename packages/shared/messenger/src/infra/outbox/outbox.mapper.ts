import { type TopicMessages } from "../contracts/message-broker.contract";
import { type MessageSendBatchInput } from "../contracts/message-publisher.contract";

export class OutboxMapper {
  public static toKafkaBatch(outboxs: MessageSendBatchInput): TopicMessages {
    const normalized: TopicMessages = [];
    for (const outbox of outboxs) {
      const topicName = `user.${outbox.eventType}`;
      const topic = normalized.find((i) => i.topic === topicName);

      if (!topic) {
        const newTopic = {
          topic: "user" + "." + outbox.eventType,
          messages: [
            {
              key: outbox.aggregateId,
              value: JSON.stringify(outbox.payload),
            },
          ],
        };
        normalized.push(newTopic);
        continue;
      }

      topic.messages.push({
        key: outbox.aggregateId,
        value: JSON.stringify(outbox.payload),
      });
    }

    return normalized;
  }
  public static toIds(outboxs: { id: string }[]): string[] {
    const ids: string[] = [];

    for (const outbox of outboxs) {
      ids.push(outbox.id);
    }

    return ids;
  }
}
