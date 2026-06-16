import { Injectable } from "@nestjs/common";
import { TrasnformerPort } from "../../application/ports/transformer.port";

@Injectable()
export class TrasnformerAdapter implements TrasnformerPort {
  public constructor() {}

  public toJSON<T>(payload: T): string {
    return JSON.stringify(payload);
  }

  toObject<T>(payload: string): T {
    return JSON.parse(payload) as T;
  }
}
