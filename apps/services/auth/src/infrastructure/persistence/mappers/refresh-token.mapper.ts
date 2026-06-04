import { RefreshToken } from "../../../domain/entities/refresh-token.entity";
import { type RefreshTokenStatus } from "../../../domain/enums/refresh-token-status";
import { TokenTimeline } from "../../../domain/value-objects/token-timeline.vo";
import { RefreshTokenOrmEntity } from "../entities/refresh-token.orm-entity";

export class RefreshTokenMapper {
  public static toDomain(orm: RefreshTokenOrmEntity): RefreshToken {
    return RefreshToken.restore(orm.id, {
      tokenHash: orm.token_hash,
      userId: orm.user_id,
      latest: orm.latest,
      status: orm.status as RefreshTokenStatus,
      refreshTokenFamilyId: orm.refresh_token_family_id,
      refreshRound: orm.refresh_round,
      previousRefreshTokenId: orm.previous_refresh_token_id,
      replacedByRefreshTokenId: orm.replaced_by_refresh_token_id,
      timeline: TokenTimeline.restore(
        orm.expires_at,
        orm.used_at,
        orm.revoked_at,
      ),
      createdAt: orm.created_at,
      editedAt: orm.edited_at,
    });
  }

  public static toOrm(domain: RefreshToken): RefreshTokenOrmEntity {
    const orm = new RefreshTokenOrmEntity();
    orm.id = domain.id;
    orm.token_hash = domain.tokenHash;
    orm.user_id = domain.userId;
    orm.latest = domain.latest;
    orm.status = domain.status;
    orm.refresh_token_family_id = domain.refreshTokenFamilyId;
    orm.refresh_round = domain.refreshRound;
    orm.previous_refresh_token_id = domain.previousRefreshTokenId;
    orm.replaced_by_refresh_token_id = domain.replacedByRefreshTokenId;
    orm.expires_at = domain.timeline.expiresAt;
    orm.used_at = domain.timeline.usedAt;
    orm.revoked_at = domain.timeline.revokedAt;
    orm.created_at = domain.createdAt;
    orm.edited_at = domain.editedAt;
    return orm;
  }
}
