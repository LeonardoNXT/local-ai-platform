import { QueryFailedError, type Repository } from "typeorm";
import { type UserRepository } from "../../application/gateway/user-repository.gateway";
import { UserOrmMapper } from "../mappers/user.orm-mapper";
import { type User } from "../../domain/entity/user/user.entity";
import { type Email } from "../../domain/value-object/email.value-object";
import { type UserOrmEntity } from "../database/entities/user.orm-entity";
import { type OutboxPort } from "@local-ai/shared-messenger";
import { UserAlreadyExistsError } from "../../errors/application/user/user-already-exists.error";

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    private readonly repository: Repository<UserOrmEntity>,
    private readonly outboxRepository: OutboxPort,
  ) {}

  public async save(user: User): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      const ormUser = UserOrmMapper.toOrm(user);
      try {
        await manager.save(ormUser);
      } catch (err) {
        if (err instanceof QueryFailedError) throw new UserAlreadyExistsError();
      }
      await this.outboxRepository.save(user.getDomainEvents(), manager);
    });
    console.log("TRANSACAO FINALIZADA");
    user.clearDomainEvents();
  }

  public async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.getValue() },
    });

    if (!entity) return null;

    return UserOrmMapper.toDomain(entity);
  }

  public async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) return null;

    return UserOrmMapper.toDomain(entity);
  }

  public async findByUsername(username: string): Promise<User[] | null> {
    const entities = await this.repository.find({
      where: { username },
    });

    const normalized = entities.map((e) => {
      return UserOrmMapper.toDomain(e);
    });

    return normalized;
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
