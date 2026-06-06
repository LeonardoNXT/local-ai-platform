export abstract class OutboxWorkerPort {
  abstract start(): Promise<void>;

  abstract stop(): void;
}
