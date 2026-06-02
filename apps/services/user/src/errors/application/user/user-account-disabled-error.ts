import { ApplicationError } from "../application-error";

export class AccountDisabledError extends ApplicationError {
  public readonly name = "AccountDisabledError";
  public readonly code = "DISABLED_ACCOUNT";

  constructor() {
    super("");
  }
}
