import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { OutboxPort } from "@local-ai/shared-messenger";
import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";

import { OAuthRepositoryPort } from "../../../application/ports/oauth-repository.port";
import { OAuthEntity } from "../../../domain/entities/oauth-client.entity";
import { OAuthAccountsMapper } from "../mappers/oauth.mapper";
import { OAuthAccountsOrmEntity } from "../entities/oauth-client.orm-entity";

@Injectable()
export class TypeormOAuthRepository implements OAuthRepositoryPort {
  public constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @Inject(OutboxPort)
    private readonly outbox: OutboxPort,
  ) {}

  private repository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
  ): Repository<T> {
    return this.dataSource.getRepository<T>(entity);
  }

  public async save(payload: OAuthEntity): Promise<void> {
    const manager = this.dataSource.manager;
    const oauthMapped = OAuthAccountsMapper.toOrm(payload);

    await manager.transaction(async (transactionManager) => {
      await transactionManager.save(OAuthAccountsOrmEntity, oauthMapped);

      console.log({
        name: "OAUTH-SAVED-A-NEW-ACCOUNT",
        payload: payload.getDomainEvents(),
      });

      await this.outbox.save(payload.getDomainEvents(), transactionManager);
    });
  }

  public async findById(payload: { id: string }): Promise<OAuthEntity | null> {
    const oauthOrm = await this.repository(OAuthAccountsOrmEntity).findOne({
      where: {
        id: payload.id,
      },
    });

    if (!oauthOrm) {
      return null;
    }

    return OAuthAccountsMapper.toDomain(oauthOrm);
  }

  public async findByProviderAccountId(payload: {
    providerAccountId: string;
  }): Promise<OAuthEntity | null> {
    const oauthOrm = await this.repository(OAuthAccountsOrmEntity).findOne({
      where: {
        providerAccountId: payload.providerAccountId,
      },
    });

    if (!oauthOrm) {
      return null;
    }

    return OAuthAccountsMapper.toDomain(oauthOrm);
  }

  public async delete(payload: { id: string }): Promise<void> {
    await this.repository(OAuthAccountsOrmEntity).delete(payload.id);
  }
}
