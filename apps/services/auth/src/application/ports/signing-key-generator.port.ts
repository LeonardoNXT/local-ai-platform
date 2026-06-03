import { type SigningKey } from "../../domain/entities/signing-key.entity";

export abstract class SigningKeyGeneratorPort {
  abstract generate(): SigningKey;
}
