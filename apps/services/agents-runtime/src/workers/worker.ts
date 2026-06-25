export default abstract class Worker {
  abstract start(...args: unknown[]): void;
  abstract stop(): void;
}
