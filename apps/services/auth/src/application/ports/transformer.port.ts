export abstract class TrasnformerPort {
  abstract toJSON<T>(payload: T): string;
  abstract toObject<T>(paylaod: string): T;
}
