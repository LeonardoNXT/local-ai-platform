import { type IdGeneratorPort } from "../../application/ports/id-generator.port";
import crypto from "crypto";
import { Injectable } from "@nestjs/common";
@Injectable()
export class NodeRandomTokenAdpater implements IdGeneratorPort {
  public generate(): string {
    return crypto.randomUUID();
  }
}
