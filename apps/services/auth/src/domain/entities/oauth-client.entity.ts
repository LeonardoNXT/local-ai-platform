import { BaseDomainEvents } from "../events/base-domain.events";
import { AggregateRoot } from "../shared/aggregate-root.shared";

export interface OAuthEntityProps {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
  createdAt: string;
}
export class OAuthEntity extends AggregateRoot {
  private readonly id: string;
  private readonly provider: string;
  private readonly providerAccountId: string;
  private readonly createdAt: string;
  private readonly userId: string;

  private constructor(payload: OAuthEntityProps) {
    super();

    this.id = payload.id;
    this.provider = payload.provider;
    this.providerAccountId = payload.providerAccountId;
    this.createdAt = payload.createdAt;
    this.userId = payload.userId;
  }

  public static create(
    payload: Omit<OAuthEntityProps, "id" | "createdAt">,
  ): OAuthEntity {
    return new OAuthEntity({
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      provider: payload.provider,
      providerAccountId: payload.providerAccountId,
      userId: payload.userId,
    });
  }

  public static restore(payload: OAuthEntityProps): OAuthEntity {
    return new OAuthEntity(payload);
  }

  public static remove(payload: OAuthEntity): void {
    payload.addDomainEvent(
      BaseDomainEvents.create({
        aggregateId: payload.id,
        eventType: "oauth.login",
        payload: {
          provider: payload.provider,
          providerAccountId: payload.providerAccountId,
          userId: payload.userId,
        },
      }),
    );
  }

  public get getId(): string {
    return this.id;
  }

  public get getProvider(): string {
    return this.provider;
  }
  public get getProviderAccountId(): string {
    return this.providerAccountId;
  }

  public get getUserId(): string {
    return this.userId;
  }
  public get getCreatedAt(): string {
    return this.createdAt;
  }
}
