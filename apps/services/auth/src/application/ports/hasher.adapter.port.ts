export type CompareProps = {
  hashed: string;
  content: string;
};

export abstract class HasherPort {
  public abstract hash: (payload: string) => Promise<string>;
  public abstract compare: (payload: CompareProps) => Promise<boolean>;
}
