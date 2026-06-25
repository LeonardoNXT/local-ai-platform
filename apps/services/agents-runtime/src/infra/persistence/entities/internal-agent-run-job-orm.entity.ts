import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("internal_agent_run_job")
export class InternalAgentRunJobOrmEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: string;

  @Column({ name: "run_id", type: "uuid" })
  runId!: string;

  @Column({
    name: "type",
    default: "start_planning",
    type: "enum",
    enum: [
      "start_planning",
      "generate_plan",
      "execute_step",
      "complete_run",
      "fail_run",
    ],
  })
  type!:
    | "start_planning"
    | "generate_plan"
    | "execute_step"
    | "complete_run"
    | "fail_run";

  @Column({
    name: "status",
    default: "pending",
    type: "enum",
    enum: ["pending", "processing", "completed", "failed"],
  })
  status!: "pending" | "processing" | "completed" | "failed";

  @Column({ name: "attempts", type: "integer" })
  attempts!: number;

  @Column({ name: "max_attempts", type: "integer" })
  maxAttempts!: number;

  @Column({ name: "available_at", type: "timestamp" })
  availableAt!: string;

  @Column({ name: "last_error", type: "varchar", nullable: true })
  lastError!: string;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: string;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt!: string;
}
