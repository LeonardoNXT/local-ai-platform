import { RefreshTokenFamilyStatus } from "../enums/refresh-token-family-status";
import type { TokenTimeline } from "../value-objects/token-timeline.vo";

export interface RefreshTokenFamilyProps {
  userId: string;
  deviceId: string;
  status: RefreshTokenFamilyStatus;
  refreshRound: number;
  revokedReason: string | null;
  timeline: TokenTimeline;
  createdAt: Date;
  editedAt: Date | null;
}

export class RefreshTokenFamily {
  private constructor(
    private readonly _id: string,
    private _props: RefreshTokenFamilyProps,
  ) {}

  public static create(
    id: string,
    props: Omit<
      RefreshTokenFamilyProps,
      "createdAt" | "status" | "refreshRound" | "revokedReason" | "editedAt"
    >,
  ): RefreshTokenFamily {
    return new RefreshTokenFamily(id, {
      ...props,
      status: RefreshTokenFamilyStatus.ACTIVE,
      refreshRound: 0,
      revokedReason: null,
      createdAt: new Date(),
      editedAt: null,
    });
  }

  public static restore(
    id: string,
    props: RefreshTokenFamilyProps,
  ): RefreshTokenFamily {
    return new RefreshTokenFamily(id, props);
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._props.userId;
  }

  get deviceId(): string {
    return this._props.deviceId;
  }

  get status(): RefreshTokenFamilyStatus {
    return this._props.status;
  }

  get refreshRound(): number {
    return this._props.refreshRound;
  }

  get revokedReason(): string | null {
    return this._props.revokedReason;
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
