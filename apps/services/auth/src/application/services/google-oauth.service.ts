import { Inject, Injectable } from "@nestjs/common";

import { PersistenceCachePort } from "../ports/persistence-cache.port";
import { OAuthFlowIntent } from "../../domain/types/oauth-flow-intent.type";
import { GoogleOAuthState } from "../../domain/types/google-oauth-state.type";
import { IdGeneratorPort } from "../ports/id-generator.port";

@Injectable()
export class GoogleOAuthService {
  private static readonly STATE_TTL_IN_SECONDS = 15 * 60;

  private static readonly STATE_KEY_PREFIX = "oauth:google:state:";

  public constructor(
    @Inject(PersistenceCachePort)
    private readonly cache: PersistenceCachePort,
    @Inject(IdGeneratorPort) private readonly idGenerator: IdGeneratorPort,
  ) {}

  public async createState(intent: OAuthFlowIntent): Promise<string> {
    const state = this.idGenerator.generate();

    const transaction: GoogleOAuthState = {
      intent,
      createdAt: new Date().toISOString(),
    };

    await this.cache.save(
      this.createStateKey(state),
      transaction,
      GoogleOAuthService.STATE_TTL_IN_SECONDS,
    );

    return state;
  }

  public async consumeState(state: string): Promise<GoogleOAuthState | null> {
    if (!state) {
      return null;
    }

    return this.cache.consume<GoogleOAuthState>(this.createStateKey(state));
  }

  private createStateKey(state: string): string {
    return `${GoogleOAuthService.STATE_KEY_PREFIX}${state}`;
  }
}
