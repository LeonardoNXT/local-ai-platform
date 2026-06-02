import { BaseDomainEvent } from "../../shared/base-domain-event";
import {
  type DomainEvent,
  type DomainEventTypes,
  type UserCreatedEventPayload,
} from "../../shared/domain-event";

export class UserCreatedDomainEvent
  extends BaseDomainEvent
  implements DomainEvent
{
  public readonly eventType: DomainEventTypes = "created";
  public readonly aggregateType = "user";

  public constructor(
    public readonly aggregateId: string,
    public readonly payload: UserCreatedEventPayload,
  ) {
    super();
  }
}
