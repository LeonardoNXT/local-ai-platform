export abstract class ClockPort {
  public abstract nowIso8601(): string;
  public abstract dateIso8601(dateInMs: number): string;
}
