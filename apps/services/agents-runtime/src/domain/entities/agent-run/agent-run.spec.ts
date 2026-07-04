import AgentRunEntity from "./agent-run.entity.ts";

describe("[ AGENT-RUN-ENTITY ]", () => {
  it("[CREATE] it must create a immutable instance of the class", () => {
    const agentRuntime = AgentRunEntity.create({
      agent_run_input_id: "0000-0000-0000-0000",
      jobId: "0000-0000-0000-0000",
      entityId: "0000-0000-0000-0000",
      eventId: "0000-0000-0000-0000",

      user_id: "0000-0000-0000-0000",
      created_at: "2025-03-01T00:00:00z",
      updated_at: "2025-03-01T00:00:00z",
      event_occurred_at: new Date("2025-03-01T00:00:00z"),
      job_available_at: "2025-03-01T00:00:00z",
    });
    expect(agentRuntime).toBeInstanceOf(AgentRunEntity);
  });

  it("[RECREATE] it must recreate a immutable instance of the class", () => {
    const agentRuntime = AgentRunEntity.restore({
      created_at: "2025-03-01T00:00:00z",
      updated_at: "2025-03-01T00:00:00z",
      current_step_index: 0,
      id: "0000-0000-0000-0000",
      plan_id: "0000-0000-0000-0000",
      planning_id: "0000-0000-0000-0000",
      status: "pending",
      user_id: "0000-0000-0000-0000",
      agent_run_input_id: "0000-0000-0000-0000",
      agent_run_output_id: "0000-0000-0000-0000",
      current_step_id: "0000-0000-0000-0000",
    });

    expect(agentRuntime).toBeInstanceOf(AgentRunEntity);
  });

  it("[UPDATE STATUS] it must update status of the class", () => {
    const agentRuntime = AgentRunEntity.restore({
      created_at: "2025-03-01T00:00:00z",
      updated_at: "2025-03-01T00:00:00z",
      current_step_index: 0,
      id: "0000-0000-0000-0000",
      plan_id: "0000-0000-0000-0000",
      planning_id: "0000-0000-0000-0000",
      status: "pending",
      user_id: "0000-0000-0000-0000",
      agent_run_input_id: "0000-0000-0000-0000",
      agent_run_output_id: "0000-0000-0000-0000",
      current_step_id: "0000-0000-0000-0000",
    });

    const agentRuntimeUpdated = agentRuntime.startSteps({
      current_step_id: "0000-0000-0000-0000",
      current_step_index: 1,
      current_step_objective: "TEST_OBJECTIVE",
      event_occurred_at: new Date("2025-03-01T01:00:00z"),
      event_id: "0000-0000-0000-0000",
      updated_at: "2025-03-01T00:00:00z",
    });

    console.log({
      update_at: agentRuntimeUpdated.status,
      status: agentRuntimeUpdated.status,
    });

    expect({
      status: agentRuntimeUpdated.status,
      updated_at: agentRuntimeUpdated.updatedAt,
    }).toStrictEqual({
      status: "running",
      updated_at: "2025-03-01T01:00:00z",
    });
  });
});
