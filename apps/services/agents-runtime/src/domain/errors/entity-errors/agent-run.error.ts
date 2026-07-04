import EntityError from "./entity.error.ts";

export default class AgentRunError extends EntityError {
  public constructor(payload: { cause?: string; message: string }) {
    super({
      cause: payload.cause,
      message: payload.message,
    });
  }
}
