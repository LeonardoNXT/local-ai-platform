export class TokenTimeline {
  private constructor(
    private readonly _expiresAt: Date,
    private readonly _usedAt: Date | null,
    private readonly _revokedAt: Date | null,
  ) {}

  public static create(expiresAt: Date): TokenTimeline {
    return new TokenTimeline(expiresAt, null, null);
  }

  public static restore(
    expiresAt: Date,
    usedAt: Date | null,
    revokedAt: Date | null,
  ): TokenTimeline {
    return new TokenTimeline(expiresAt, usedAt, revokedAt);
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }
  get usedAt(): Date | null {
    return this._usedAt;
  }
  get revokedAt(): Date | null {
    return this._revokedAt;
  }

  public isExpired(): boolean {
    return new Date() > this._expiresAt;
  }
}
