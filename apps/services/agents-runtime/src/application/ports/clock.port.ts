export default abstract class ClockPort {
  abstract nowIsoString(): string;
  abstract now(): number;
  abstract toIsoString(date: number): string;
}
