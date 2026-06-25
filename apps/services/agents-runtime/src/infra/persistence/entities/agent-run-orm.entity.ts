import { Column, Entity, PrimaryColumn } from "typeorm";
import {
  AgentRunArtifact,
  AgentRunPlan,
  AgentRunPlanning,
  Status,
} from "../../../domain/entities/agent-run/agent-run.props.ts";

@Entity("agent_run")
export class AgentRunEntityOrm {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: string;
  @Column({
    name: "status",
    type: "enum",
    enum: ["pending", "running", "completed", "failed"],
    default: "pending",
  })
  status!: Status;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "planning", type: "jsonb", nullable: true, default: null })
  planning!: AgentRunPlanning | null;

  @Column({ name: "plan", type: "jsonb", nullable: true, default: null })
  plan!: AgentRunPlan | null;

  @Column({ name: "current_step_index", type: "integer" })
  currentStepIndex!: number;

  @Column({ name: "artifacts", type: "jsonb", default: null })
  artifacts!: AgentRunArtifact[];

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: string;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt!: string;
}
