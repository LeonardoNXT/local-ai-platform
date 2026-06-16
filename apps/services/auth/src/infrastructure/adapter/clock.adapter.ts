import { Injectable } from "@nestjs/common";
import { type ClockPort } from "../../application/ports/clock.port";

@Injectable()
export class ClockAdapter implements ClockPort {
  public nowIso8601(): string {
    return new Date().toISOString();
  }

  public dateIso8601(date: number): string {
    return new Date(date).toISOString();
  }
}
