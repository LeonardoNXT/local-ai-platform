import type { DomainEventType } from "../types/domain-event.types.ts";

export abstract class AggregateRoot {
  private domainEventsContent: DomainEventType[] = [];

  protected addDomainEvent(domainEvent: DomainEventType): void {
    this.domainEventsContent.push(domainEvent);
  }

  public get domainEvents(): DomainEventType[] {
    return [...this.domainEventsContent];
  }

  public clearDomainEvents(): void {
    this.domainEventsContent = [];
  }
}
