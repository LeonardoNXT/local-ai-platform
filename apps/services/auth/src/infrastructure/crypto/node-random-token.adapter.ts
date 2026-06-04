import { type IdGeneratorPort } from "../../application/ports/id-generator.port";
import crypto from "crypto";

export class NodeRandomTokenAdpater implements IdGeneratorPort {
  public generate(): string {
    return crypto.randomUUID();
  }
}
