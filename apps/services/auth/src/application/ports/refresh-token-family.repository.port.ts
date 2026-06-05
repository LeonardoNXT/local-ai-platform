import { type RefreshTokenFamily } from "../../domain/entities/refresh-token-family.entity";

export abstract class RefreshTokenFamilyRepositoryPort {
  public abstract save(payload: RefreshTokenFamily): Promise<void>;
  public abstract findById(payload: {
    id: string;
  }): Promise<RefreshTokenFamily | null>;
  public abstract delete(payload: { id: string }): Promise<void>;
}
