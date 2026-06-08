import { RefreshTokenStatus } from "../enums/refresh-token-status";
import { BaseDomainEvents } from "../events/base-domain.events";
import { AggregateRoot } from "../shared/aggregate-root.shared";
import { TokenTimeline } from "../value-objects/token-timeline.vo";

export interface RefreshTokenProps {
  tokenHash: string;
  userId: string;
  latest: boolean;
  status: RefreshTokenStatus;
  refreshTokenFamilyId: string;
  refreshRound: number;
  previousRefreshTokenId: string | null;
  replacedByRefreshTokenId: string | null;
  timeline: TokenTimeline;
  createdAt: Date;
  editedAt: Date | null;
}

export class RefreshToken extends AggregateRoot {
  private constructor(
    private readonly _id: string,
    private readonly _props: RefreshTokenProps,
  ) {
    super();
  }

  public static create(
    id: string,
    props: Omit<
      RefreshTokenProps,
      "createdAt" | "latest" | "status" | "editedAt"
    >,
  ): RefreshToken {
    const refreshToken = new RefreshToken(id, {
      ...props,
      latest: true,
      status: RefreshTokenStatus.ACTIVE,
      createdAt: new Date(),
      editedAt: null,
    });

    refreshToken.addDomainEvent(
      BaseDomainEvents.create({
        eventType: "created",
        aggregateId: refreshToken.id,
        payload: {
          userId: refreshToken.userId,
          refreshTokenId: refreshToken.id,
        },
      }),
    );

    return refreshToken;
  }

  public rotate({
    refresh_token_id,
  }: {
    refresh_token_id: string;
  }): RefreshToken {
    const refreshToken = RefreshToken.restore(refresh_token_id, {
      createdAt: this.createdAt,
      editedAt: new Date(),
      latest: false,
      previousRefreshTokenId: this.previousRefreshTokenId,
      refreshRound: this.refreshRound,
      refreshTokenFamilyId: this.refreshTokenFamilyId,
      replacedByRefreshTokenId: refresh_token_id,
      status: RefreshTokenStatus.EXPIRED,
      tokenHash: this.tokenHash,
      userId: this.userId,
      timeline: TokenTimeline.restore(
        this.timeline.expiresAt,
        new Date(),
        null,
      ),
    });

    refreshToken.addDomainEvent(
      BaseDomainEvents.create({
        eventType: "rotated",
        aggregateId: refreshToken.id,
        payload: {
          userId: refreshToken.userId,
          refreshTokenId: refreshToken.id,
        },
      }),
    );

    return refreshToken;
  }

  public Revoke(): RefreshToken {
    const refreshToken = RefreshToken.restore(this.id, {
      createdAt: this.createdAt,
      editedAt: new Date(),
      latest: this.latest,
      previousRefreshTokenId: this.previousRefreshTokenId,
      refreshRound: this.refreshRound,
      refreshTokenFamilyId: this.refreshTokenFamilyId,
      replacedByRefreshTokenId: this.replacedByRefreshTokenId,
      status: RefreshTokenStatus.REVOKED,
      timeline: TokenTimeline.restore(
        this.timeline.expiresAt,
        new Date(),
        new Date(),
      ),
      tokenHash: this.tokenHash,
      userId: this.userId,
    });

    refreshToken.addDomainEvent(
      BaseDomainEvents.create({
        eventType: "revoked",
        aggregateId: refreshToken.id,
        payload: {
          userId: refreshToken.userId,
          refreshTokenId: refreshToken.id,
        },
      }),
    );

    return refreshToken;
  }

  public static restore(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props);
  }

  public get id(): string {
    return this._id;
  }

  public get tokenHash(): string {
    return this._props.tokenHash;
  }

  public get userId(): string {
    return this._props.userId;
  }

  public get latest(): boolean {
    return this._props.latest;
  }

  public get status(): RefreshTokenStatus {
    return this._props.status;
  }

  public get refreshTokenFamilyId(): string {
    return this._props.refreshTokenFamilyId;
  }

  public get refreshRound(): number {
    return this._props.refreshRound;
  }

  public get previousRefreshTokenId(): string | null {
    return this._props.previousRefreshTokenId;
  }

  public get replacedByRefreshTokenId(): string | null {
    return this._props.replacedByRefreshTokenId;
  }

  public get timeline(): TokenTimeline {
    return this._props.timeline;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public get editedAt(): Date | null {
    return this._props.editedAt;
  }
}
