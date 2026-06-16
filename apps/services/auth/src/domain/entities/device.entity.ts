import type { DeviceLocation } from "../value-objects/device-location.vo";

export enum DeviceType {
  DESKTOP = "desktop",
  MOBILE = "mobile",
  TABLET = "tablet",
  CONSOLE = "console",
  EMBEDDED = "embedded",
  SMART_TV = "smarttv",
  WEARABLE = "wearable",
  XR = "xr",
  UNKNOWN = "unknown",
}
export interface DeviceProps {
  name: string | null;
  type: DeviceType;
  location: DeviceLocation;
  userAgent: string;
  lastSeenAt: Date;
  createdAt: Date;
  editedAt: Date | null;
}

export class Device {
  private constructor(
    private readonly _id: string,
    private _props: DeviceProps,
  ) {}

  public static create(
    id: string,
    props: Omit<DeviceProps, "createdAt" | "lastSeenAt" | "editedAt">,
  ): Device {
    if (!id) throw new Error("Device ID é obrigatório.");
    return new Device(id, {
      ...props,
      lastSeenAt: new Date(),
      createdAt: new Date(),
      editedAt: null,
    });
  }

  public static restore(id: string, props: DeviceProps): Device {
    return new Device(id, props);
  }

  public use(now: string): Device {
    return new Device(this.id, {
      ...this,
      lastSeenAt: now,
    });
  }

  get id(): string {
    return this._id;
  }

  get name(): string | null {
    return this._props.name;
  }

  get type(): DeviceType {
    return this._props.type;
  }

  get location(): DeviceLocation {
    return this._props.location;
  }

  get userAgent(): string {
    return this._props.userAgent;
  }

  get lastSeenAt(): Date {
    return this._props.lastSeenAt;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get editedAt(): Date | null {
    return this._props.editedAt;
  }
}
