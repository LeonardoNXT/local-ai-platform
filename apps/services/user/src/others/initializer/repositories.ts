import { type UserRepository } from "../../application/gateway/user-repository.gateway";
import { UserOrmEntity } from "../../infra/database/entities/user.orm-entity";
import { TypeOrmUserRepository } from "../../infra/repositories/typeorm-user.repository";
import {
  type OutboxPort,
  TypeOrmOutboxRepository,
} from "@local-ai/shared-messenger";
import { type DataSource } from "typeorm/browser";

type RepositoriesInitializerAllProps = {
  dataSource: DataSource;
};

export type Repositories = {
  outboxRepository: OutboxPort;
  userRepository: UserRepository;
};

export class RepositoriesInitializer {
  public static all({
    dataSource,
  }: RepositoriesInitializerAllProps): Repositories {
    const outboxRepository = new TypeOrmOutboxRepository(dataSource);

    const userRepository = new TypeOrmUserRepository(
      dataSource.getRepository(UserOrmEntity),
      outboxRepository,
    );

    return {
      outboxRepository,
      userRepository,
    };
  }
}
