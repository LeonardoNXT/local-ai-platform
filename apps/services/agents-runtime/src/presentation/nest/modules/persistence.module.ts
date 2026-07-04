import { Module } from "@nestjs/common";
import {
  OutboxPort,
  TypeOrmOutboxRepository,
} from "@local-ai/shared-messenger";
import { DataSource } from "typeorm";
import AgentRunRepositoryPort from "../../../application/ports/agent-run-repository.port.ts";
import AgentRunRepository from "../../../infra/persistence/repositories/agent-run.repository.ts";
import { TypeOrmInitializer } from "../../../infra/initializer.ts";
import InternalAgentJobComposition from "../../../infra/persistence/composition/internal-agent-run-job.composition.ts";

@Module({
  providers: [
    {
      provide: InternalAgentJobComposition,
      useClass: InternalAgentJobComposition,
    },
    {
      provide: OutboxPort,
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => {
        return TypeOrmOutboxRepository.create(dataSource);
      },
    },
    {
      provide: AgentRunRepositoryPort,
      inject: [TypeOrmInitializer, InternalAgentJobComposition, OutboxPort],
      useFactory: (
        dataSource: DataSource,
        internalAgentJobComposition: InternalAgentJobComposition,
        outboxRepository: OutboxPort,
      ): AgentRunRepositoryPort => {
        return new AgentRunRepository(
          dataSource,
          internalAgentJobComposition,
          outboxRepository,
        );
      },
    },
  ],
})
export class PersistenceModule {}
