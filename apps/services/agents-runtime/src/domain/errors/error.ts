export default class DomainError extends Error {
  public readonly code: string;

  public constructor(payload: {
    code: string;
    cause?: string;
    message: string;
  }) {
    super(payload.message);
    this.cause = payload.cause;
    this.code = payload.code;
  }
}
