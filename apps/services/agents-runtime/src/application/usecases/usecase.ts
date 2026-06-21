export abstract class Usecase<T, K> {
  public abstract execute(input: T): Promise<K>;
}
