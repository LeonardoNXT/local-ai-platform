import { ErrorContract } from "../error-contract";

export abstract class ApplicationError extends ErrorContract {
  public abstract readonly name: string;
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
  }
}
