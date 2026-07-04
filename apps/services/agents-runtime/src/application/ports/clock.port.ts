export default abstract class ClockPort {
  abstract date(): Date;
  abstract nowIsoString(): string;
  abstract now(): number;
  abstract toIsoString(date: number): string;
}
