import { type RefreshToken } from "../../domain/entities/refresh-token.entity";

export abstract class RefreshTokenRepositoryPort {
  public abstract save(payload: RefreshToken): Promise<void>;
  public abstract findById(payload: {
    id: string;
  }): Promise<RefreshToken | null>;
  public abstract delete(payload: { id: string }): Promise<void>;
}
