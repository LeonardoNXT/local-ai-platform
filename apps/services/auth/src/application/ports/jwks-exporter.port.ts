import { type SigningKey } from "../../domain/entities/signing-key.entity";

export type JsonWebKeySet = {
  keys: Array<Record<string, unknown>>;
};

export abstract class JwksExporterPort {
  abstract export(signingKey: SigningKey): Promise<JsonWebKeySet>;
}
