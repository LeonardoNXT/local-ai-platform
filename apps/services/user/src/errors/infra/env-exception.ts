export class EnvironmentException extends Error {
  public readonly name = "EnvExecption";

  public constructor(value: string) {
    super(value);
  }
}
