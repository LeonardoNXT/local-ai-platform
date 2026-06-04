export class DeviceLocation {
  private constructor(
    private readonly _city: string | null,
    private readonly _region: string | null,
    private readonly _country: string | null,
    private readonly _countryCode: string | null,
  ) {}

  public static create(props: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
  }): DeviceLocation {
    return new DeviceLocation(
      props.city ?? null,
      props.region ?? null,
      props.country ?? null,
      props.countryCode ?? null,
    );
  }

  get city(): string | null {
    return this._city;
  }
  get region(): string | null {
    return this._region;
  }
  get country(): string | null {
    return this._country;
  }
  get countryCode(): string | null {
    return this._countryCode;
  }

  public equals(other: DeviceLocation): boolean {
    return (
      this.city === other.city &&
      this.region === other.region &&
      this.country === other.country
    );
  }
}

export class NetworkFingerprint {
  private constructor(
    private readonly _ipAddress: string | null,
    private readonly _userAgent: string,
  ) {
    if (!_userAgent)
      throw new Error("User Agent é obrigatório para o fingerprint.");
  }

  public static create(
    userAgent: string,
    ipAddress?: string | null,
  ): NetworkFingerprint {
    return new NetworkFingerprint(ipAddress ?? null, userAgent);
  }

  get ipAddress(): string | null {
    return this._ipAddress;
  }
  get userAgent(): string {
    return this._userAgent;
  }

  public isSameDevice(other: NetworkFingerprint): boolean {
    return this.userAgent === other.userAgent;
  }
}

export class TokenTimeline {
  private constructor(
    private readonly _expiresAt: Date,
    private readonly _usedAt: Date | null,
    private readonly _revokedAt: Date | null,
  ) {
    if (_expiresAt <= new Date() && !_usedAt && !_revokedAt) {
      throw new Error("Data de expiração inválida.");
    }
  }

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
