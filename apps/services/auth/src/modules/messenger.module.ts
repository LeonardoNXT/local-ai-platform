import {
  MessagePublisherContract,
  OutboxPort,
  OutboxWorker,
  OutboxWorkerPort,
} from "@local-ai/shared-messenger";
import { DynamicModule, Module } from "@nestjs/common";
import { PersistenceModule } from "./persistence.module";

@Module({})
export class MessengerModule {
  public constructor() {}

  public static create(
    messagePublisher: MessagePublisherContract,
  ): DynamicModule {
    return {
      module: MessengerModule,
      imports: [PersistenceModule],
      providers: [
        {
          provide: MessagePublisherContract,
          useValue: messagePublisher,
        },
        {
          provide: OutboxWorkerPort,
          inject: [MessagePublisherContract, OutboxPort],
          useFactory: (
            messagePublisher: MessagePublisherContract,
            repository: OutboxPort,
          ) => {
            return OutboxWorker.create(messagePublisher, repository);
          },
        },
      ],
      exports: [MessagePublisherContract, OutboxWorkerPort],
    };
  }
}
