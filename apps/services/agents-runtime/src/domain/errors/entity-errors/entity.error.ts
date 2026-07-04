import DomainError from "../error.ts";

export default class EntityError extends DomainError {
  public constructor(payload: { message: string; cause?: string }) {
    super({
      code: "ENTITY_ERROR",
      message: payload.message,
      cause: payload.cause,
    });
  }
}
