import { InjectDataSource } from "@nestjs/typeorm";
import { RefreshTokenRepositoryPort } from "../../../application/ports/refresh-token.repository.port";
import { RefreshTokenOrmEntity } from "../entities/refresh-token.orm-entity";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import { RefreshTokenMapper } from "../mappers/refresh-token.mapper";
import { Inject, Injectable } from "@nestjs/common";
import { OutboxPort } from "@local-ai/shared-messenger";

@Injectable()
export class TypeormRefreshTokenRepository implements RefreshTokenRepositoryPort {
  public constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(OutboxPort) private readonly outbox: OutboxPort,
  ) {}

  private repository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    return this.dataSource.getRepository<T>(entity);
  }

  public async save(payload: RefreshToken): Promise<void> {
    const manager = this.dataSource.manager;
    const refreshTokenMapped = RefreshTokenMapper.toOrm(payload);
    const repository = this.repository(RefreshTokenOrmEntity);

    await manager.transaction(async () => {
      await repository.save(refreshTokenMapped);
      await this.outbox.save(payload.getDomainEvents(), manager);
    });
  }

  public async findById(payload: { id: string }): Promise<RefreshToken | null> {
    const refreshTokenORM = await this.repository(
      RefreshTokenOrmEntity,
    ).findOne({
      where: {
        id: payload.id,
      },
    });

    if (!refreshTokenORM) {
      return null;
    }

    const refreshToken = RefreshTokenMapper.toDomain(refreshTokenORM);

    return refreshToken;
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository(RefreshTokenOrmEntity).delete(payload.id);
    return;
  }
}
