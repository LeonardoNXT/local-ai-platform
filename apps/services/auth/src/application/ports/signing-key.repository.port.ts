import { type SigningKey } from "../../domain/entities/signing-key.entity";

export abstract class SigningKeyRepositoryPort {
  abstract findActive(): Promise<SigningKey | null>;
  abstract save(signingKey: SigningKey): Promise<void>;
}
