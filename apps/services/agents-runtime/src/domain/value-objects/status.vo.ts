import type { Status } from "../entities/agent-run/agent-run.props.ts";
import type { ValueObjects } from "../types/value-objects.types.ts";

const status: Status[] = [
  "pending",
  "planning",
  "running",
  "waiting_confirmation",
  "deferred",
  "completed",
  "failed",
  "canceled",
];

export default class StatusVo implements ValueObjects<Status, Status> {
  private readonly status: Status;

  private constructor(status: Status) {
    this.status = status;
  }

  public static create(payload: Status): StatusVo {
    if (!status.includes(payload)) {
      throw new Error("This status does not exist.");
    }
    return new StatusVo(payload);
  }

  public getValue(): Status {
    return this.status;
  }

  public equals(payload: Status): boolean {
    return payload === this.status;
  }
}
