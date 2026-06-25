import type { DomainEventType } from "../types/domain-event.types.ts";
import type { InternalAgentRunJob } from "../types/internal-job.types.ts";

export abstract class AggregateRoot {
  private domainEventsContent: DomainEventType[] = [];
  private internalJobsContent: InternalAgentRunJob[] = [];

  protected addDomainEvent(domainEvent: DomainEventType): void {
    this.domainEventsContent.push(domainEvent);
  }

  protected addInternalJob(internalJob: InternalAgentRunJob): void {
    this.internalJobsContent.push(internalJob);
  }

  public get domainEvents(): DomainEventType[] {
    return [...this.domainEventsContent];
  }

  public get internalJobs(): InternalAgentRunJob[] {
    return [...this.internalJobsContent];
  }

  public clearDomainEvents(): void {
    this.domainEventsContent = [];
  }

  public clearInternalJobs(): void {
    this.internalJobsContent = [];
  }

  public clearAll(): void {
    this.domainEventsContent = [];
    this.internalJobsContent = [];
  }
}
