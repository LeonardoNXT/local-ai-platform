import {
  DynamicModule,
  Inject,
  Module,
  OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { EnsureSigningKeyUsecase } from "../application/usecases/discovery/ensure-signing-key.usecase";
import {
  MessagePublisherContract,
  OutboxWorkerPort,
} from "@local-ai/shared-messenger";
import { OidcModule } from "./oidc.module";
import { MessengerModule } from "./messenger.module";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "../infrastructure/http/errors/global-exception.filter";

@Module({})
export class AppBootstrapModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly ensureSigningKey: EnsureSigningKeyUsecase,
    @Inject(OutboxWorkerPort) private readonly outboxWorker: OutboxWorkerPort,
  ) {}

  public static create(
    messagePublisher: MessagePublisherContract,
  ): DynamicModule {
    return {
      module: AppBootstrapModule,
      imports: [OidcModule, MessengerModule.create(messagePublisher)],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
      ],
    };
  }

  public async onModuleInit() {
    await this.ensureSigningKey.execute();
    this.outboxWorker.start().catch((err) => {
      console.error("Erro no Outbox Worker:", err);
    });
  }

  onModuleDestroy() {
    this.outboxWorker.stop();
  }
}
