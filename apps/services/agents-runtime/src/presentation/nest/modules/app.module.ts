import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmInitializer } from "../../../infra/initializer.ts";
import { InternalAgentRunJobOrmEntity } from "../../../infra/persistence/entities/internal-agent-run-job-orm.entity.ts";
import { PersistenceModule } from "./persistence.module.ts";
import { DataSource } from "typeorm";
import AgentRunEntityOrm from "../../../infra/persistence/entities/agent-run-orm.entity.ts";

@Module({})
export class AppModule {
  public static create(): DynamicModule {
    return {
      module: AppModule,
      imports: [PersistenceModule],
      providers: [
        {
          provide: DataSource,
          useValue: TypeOrmInitializer.create([
            AgentRunEntityOrm,
            InternalAgentRunJobOrmEntity,
          ]),
        },
      ],
    };
  }
}
