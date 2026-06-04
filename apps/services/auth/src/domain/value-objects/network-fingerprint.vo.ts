export class NetworkFingerprint {
  private constructor(
    private readonly _userAgent: string | null,
    private readonly _ipAddress: string | null,
  ) {}

  public static create(
    userAgent: string | null,
    ipAddress?: string | null,
  ): NetworkFingerprint {
    return new NetworkFingerprint(userAgent ?? null, ipAddress ?? null);
  }

  get userAgent(): string | null {
    return this._userAgent;
  }
  get ipAddress(): string | null {
    return this._ipAddress;
  }

  public isSameDevice(other: NetworkFingerprint): boolean {
    return this.userAgent === other.userAgent;
  }
}
