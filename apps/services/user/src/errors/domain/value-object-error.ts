import { ErrorContract } from "../error-contract";

export class ValueObjectError extends ErrorContract {
  public readonly name: string;
  public readonly code: string;

  constructor(message: string) {
    super(message);
  }
}
