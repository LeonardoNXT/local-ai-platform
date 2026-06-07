import { type DomainEventType } from "./domain-events-type.shared";

export abstract class AggregateRoot {
  private events: DomainEventType[] = [];

  protected addDomainEvent(domainEvent: DomainEventType): void {
    this.events.push(domainEvent);
  }

  public getDomainEvents(): DomainEventType[] {
    return this.events;
  }

  public clearDomainEvents(): void {
    this.events = [];
  }
}
