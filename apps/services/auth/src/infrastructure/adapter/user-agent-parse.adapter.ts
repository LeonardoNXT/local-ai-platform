import { Injectable } from "@nestjs/common";
import type {
  UserAgentParsePort,
  UserAgentParseProps,
} from "../../application/ports/user-agent-parse.port";
import { UAParser } from "ua-parser-js";
import { DeviceType } from "../../domain/entities/device.entity";

Injectable();
export class UserAgentParseAdapter implements UserAgentParsePort {
  public parse(payload: string): UserAgentParseProps {
    const parser = new UAParser(payload);
    const result = parser.getResult();

    return {
      browser_name: result.browser?.name ?? "Unknown",
      os_name: String(result.os),
      os_version: String(result.engine.name),
      device: {
        type: this.mapDeviceType(result.device.type),
        model: result.device.model,
        vendor: result.device.vendor,
      },
    };
  }

  private mapDeviceType(type?: string): DeviceType {
    switch (type) {
      case "desktop":
        return DeviceType.DESKTOP;

      case "mobile":
        return DeviceType.MOBILE;

      case "tablet":
        return DeviceType.TABLET;

      case "console":
        return DeviceType.CONSOLE;

      case "embedded":
        return DeviceType.EMBEDDED;

      case "smarttv":
        return DeviceType.SMART_TV;

      case "wearable":
        return DeviceType.WEARABLE;

      case "xr":
        return DeviceType.XR;

      default:
        return DeviceType.UNKNOWN;
    }
  }
}
