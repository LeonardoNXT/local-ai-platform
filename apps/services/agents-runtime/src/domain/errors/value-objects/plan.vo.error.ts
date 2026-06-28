import { ValueObjectError } from "./value-objects.error.ts";

export class PlanVoError extends ValueObjectError {
  public constructor(payload: { cause?: string; message: string }) {
    super({
      cause: payload.cause,
      message: payload.message,
    });
  }
}
