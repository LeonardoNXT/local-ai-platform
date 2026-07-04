import { Column, Entity, PrimaryColumn } from "typeorm";
import { Status } from "../../../domain/types/props/agent-run.props.ts";

@Entity("agent_run")
export default class AgentRunEntityOrm {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: string;
  @Column({
    name: "status",
    type: "enum",
    enum: ["pending", "running", "completed", "failed"],
    default: "pending",
  })
  status!: Status;

  @Column({ name: "agent_run_input_id", type: "uuid" })
  agentRunInputId!: string;

  @Column({ name: "agent_run_input_output", type: "uuid", nullable: true })
  agentRunOutputId!: string | undefined;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "planning_id", type: "uuid", nullable: true, default: null })
  planningId!: string | undefined;

  @Column({ name: "plan_id", type: "uuid", nullable: true, default: null })
  planId!: string | undefined;

  @Column({ name: "current_step_id", type: "uuid", nullable: true })
  currentStepId!: string | undefined;

  @Column({ name: "current_step_index", type: "integer" })
  currentStepIndex!: number;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: string;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt!: string;
}
