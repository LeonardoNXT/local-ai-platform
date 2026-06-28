export default abstract class Worker {
  abstract start(...args: unknown[]): Promise<void>;
  abstract stop(): void;
}
