import {
  type CompareProps,
  type HasherPort,
} from "../../application/ports/hasher.adapter.port";
import * as argon2 from "argon2";
import { Injectable } from "@nestjs/common";
@Injectable()
export class Argon2HasherAdapter implements HasherPort {
  public async hash(payload: string): Promise<string> {
    return await argon2.hash(payload, {
      type: argon2.argon2id,
    });
  }

  public async compare(payload: CompareProps): Promise<boolean> {
    return await argon2.verify(payload.hashed, payload.content);
  }
}
