export default abstract class UseCase<T, K> {
  public abstract execute(input: T): Promise<K>;
}
