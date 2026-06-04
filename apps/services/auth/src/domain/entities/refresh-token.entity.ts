import { RefreshTokenStatus } from "../enums/refresh-token-status";
import type { TokenTimeline } from "../value-objects/token-timeline.vo";

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

export class RefreshToken {
  private constructor(
    private readonly _id: string,
    private _props: RefreshTokenProps,
  ) {}

  public static create(
    id: string,
    props: Omit<
      RefreshTokenProps,
      "createdAt" | "latest" | "status" | "editedAt"
    >,
  ): RefreshToken {
    return new RefreshToken(id, {
      ...props,
      latest: true,
      status: RefreshTokenStatus.ACTIVE,
      createdAt: new Date(),
      editedAt: null,
    });
  }

  public static restore(id: string, props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(id, props);
  }

  get id(): string {
    return this._id;
  }

  get tokenHash(): string {
    return this._props.tokenHash;
  }

  get userId(): string {
    return this._props.userId;
  }

  get latest(): boolean {
    return this._props.latest;
  }

  get status(): RefreshTokenStatus {
    return this._props.status;
  }

  get refreshTokenFamilyId(): string {
    return this._props.refreshTokenFamilyId;
  }

  get refreshRound(): number {
    return this._props.refreshRound;
  }

  get previousRefreshTokenId(): string | null {
    return this._props.previousRefreshTokenId;
  }

  get replacedByRefreshTokenId(): string | null {
    return this._props.replacedByRefreshTokenId;
  }

  get timeline(): TokenTimeline {
    return this._props.timeline;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get editedAt(): Date | null {
    return this._props.editedAt;
  }
}
