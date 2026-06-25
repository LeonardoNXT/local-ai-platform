import { DataSource } from "typeorm";
import Worker from "./worker.ts";
import AgentRunRepositoryPort from "../application/ports/agent-run-repository.port.ts";
import AgentRunEntity from "../domain/entities/agent-run/agent-run.entity.ts";

export default abstract class AgentRunJobWorker implements Worker {
  private started: boolean = false;
  public constructor(private readonly repository: AgentRunRepositoryPort) {}
  public async start(): Promise<void> {
    this.started = true;
    while (this.started) {}
  }

  public stop(): void {}
}
