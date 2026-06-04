import type { DeviceType } from "../../domain/entities/device.entity";

export type UserAgentParseProps = {
  browser_name: string;
  os_name: string;
  os_version: string;
  device: {
    type?: DeviceType;
    vendor?: string;
    model?: string;
  };
};

export abstract class UserAgentParsePort {
  public abstract parse(payload: string): UserAgentParseProps;
}
