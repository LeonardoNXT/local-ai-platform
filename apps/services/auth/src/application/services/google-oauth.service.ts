import { Injectable, Inject } from "@nestjs/common";
import { PersistenceCachePort } from "../ports/persistence-cache.port";
import { IdGeneratorPort } from "../ports/id-generator.port";
import { TrasnformerPort } from "../ports/transformer.port";

type Methods = "login" | "register";

type CreatePayload = {
  method: Methods;
};

type ToJSONPayload = {
  method: Methods;
};

type GetPayload = {
  key: string;
};

type GetResponse = {
  method: Methods | null;
};
@Injectable()
export class OAuthCacheDistributedService {
  public constructor(
    @Inject(PersistenceCachePort)
    private readonly persistenceCache: PersistenceCachePort,
    @Inject(IdGeneratorPort) private readonly idGenerator: IdGeneratorPort,
    @Inject(TrasnformerPort) private readonly transformerType: TrasnformerPort,
  ) {}

  public async create(input: CreatePayload): Promise<{ id: string }> {
    const id = this.idGenerator.generate();

    const payload = {
      method: input.method,
    };

    const stringfied = this.transformerType.toJSON<ToJSONPayload>(payload);

    await this.persistenceCache.create({
      key: id,
      value: stringfied,
      config: {
        expirateInSec: 60 * 15,
      },
    });

    return {
      id,
    };
  }

  public async get(input: GetPayload): Promise<GetResponse> {
    const valueStringfied = await this.persistenceCache.getDel({
      key: input.key,
    });

    if (!valueStringfied) {
      return {
        method: null,
      };
    }

    const parsedMethod = this.transformerType.toObject<{
      method: Methods;
    }>(valueStringfied);

    return {
      method: parsedMethod.method,
    };
  }
}
