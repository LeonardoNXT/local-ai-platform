import { type OAuthEntity } from "../../domain/entities/oauth-client.entity";

export abstract class OAuthRepositoryPort {
  public abstract save(payload: OAuthEntity): Promise<void>;
  public abstract findByProviderAccountId(payload: {
    providerAccountId: string;
  }): Promise<OAuthEntity | null>;
  public abstract delete(payload: { id: string }): Promise<void>;
}
