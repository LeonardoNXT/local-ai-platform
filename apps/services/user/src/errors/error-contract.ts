export abstract class ErrorContract extends Error {
  public abstract readonly name: string;
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
  }
}

export type ErrorConstructor = new (message: string) => ErrorContract;
