import DomainError from "../error.ts";
export class ValueObjectError extends DomainError {
  public constructor(payload: { message: string; cause?: string }) {
    super({
      code: "VALUE_OBJECT_ERROR",
      cause: payload.cause,
      message: payload.message,
    });
  }
}
