import { BaseDomainEvent } from "../../shared/base-domain-event";
import {
  type DomainEvent,
  type UserBannedEventPayload,
} from "../../shared/domain-event";

export class UserBannedDomainEvent
  extends BaseDomainEvent
  implements DomainEvent
{
  public readonly eventType = "banned";
  public readonly aggregateType = "user";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: UserBannedEventPayload,
  ) {
    super();
  }
}
