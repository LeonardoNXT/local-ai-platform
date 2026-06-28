import type Worker from "./worker.ts";
import type AgentRunRepositoryPort from "../application/ports/agent-run-repository.port.ts";

export default abstract class AgentRunJobWorker implements Worker {
  private started: boolean = false;
  public constructor(private readonly repository: AgentRunRepositoryPort) {}
  public async start(): Promise<void> {
    this.started = true;
    while (this.started) {
      const pendingAgentJobs = await this.repository.findPending();

      if (pendingAgentJobs.length === 0) return;
      try {
        pendingAgentJobs.forEach((agentJobs) => {});
      } catch (err) {
        console.log(err);
      }
    }
  }

  public stop(): void {}
}
