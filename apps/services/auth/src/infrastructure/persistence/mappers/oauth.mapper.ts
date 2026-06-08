import { OAuthEntity } from "../../../domain/entities/oauth-client.entity";
import { OAuthAccountsOrmEntity } from "../entities/oauth-client.orm-entity";

export class OAuthAccountsMapper {
  public static toDomain(orm: OAuthAccountsOrmEntity): OAuthEntity {
    return OAuthEntity.restore({
      id: orm.id,
      userId: orm.userId,
      provider: orm.provider,
      providerAccountId: orm.providerAccountId,
      createdAt: orm.createdAt,
    });
  }

  public static toOrm(domain: OAuthEntity): OAuthAccountsOrmEntity {
    const orm = new OAuthAccountsOrmEntity();

    orm.id = domain.getId;
    orm.userId = domain.getUserId;
    orm.provider = domain.getProvider;
    orm.providerAccountId = domain.getProviderAccountId;
    orm.createdAt = domain.getCreatedAt;

    return orm;
  }
}
