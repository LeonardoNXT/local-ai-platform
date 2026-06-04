import { RefreshTokenFamily } from "../../../domain/entities/refresh-token-family.entity";
import { type RefreshTokenFamilyStatus } from "../../../domain/enums/refresh-token-family-status";

import { TokenTimeline } from "../../../domain/value-objects/token-timeline.vo";
import { RefreshTokenFamilyOrmEntity } from "../entities/refresh-token-family.orm-entity";

export class RefreshTokenFamilyMapper {
  public static toDomain(orm: RefreshTokenFamilyOrmEntity): RefreshTokenFamily {
    return RefreshTokenFamily.restore(orm.id, {
      userId: orm.user_id,
      deviceId: orm.device_id,
      status: orm.status as RefreshTokenFamilyStatus,
      refreshRound: orm.refresh_round,
      revokedReason: orm.revoked_reason,
      timeline: TokenTimeline.restore(orm.expires_at, null, orm.revoked_at),
      createdAt: orm.created_at,
      editedAt: orm.edited_at,
    });
  }

  public static toOrm(domain: RefreshTokenFamily): RefreshTokenFamilyOrmEntity {
    const orm = new RefreshTokenFamilyOrmEntity();
    orm.id = domain.id;
    orm.user_id = domain.userId;
    orm.device_id = domain.deviceId;
    orm.status = domain.status;
    orm.refresh_round = domain.refreshRound;
    orm.revoked_reason = domain.revokedReason;
    orm.expires_at = domain.timeline.expiresAt;
    orm.revoked_at = domain.timeline.revokedAt;
    orm.created_at = domain.createdAt;
    orm.edited_at = domain.editedAt;
    return orm;
  }
}
