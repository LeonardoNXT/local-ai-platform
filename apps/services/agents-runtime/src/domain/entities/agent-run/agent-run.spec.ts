import AgentRunEntity from "./agent-run.entity.ts";

describe("[ AGENT-RUN-ENTITY ]", () => {
  it("[CREATE] it must create a immutable instance of the class", () => {
    const agentRuntime = AgentRunEntity.create(
      "0000-0000-0000-0000",
      "0000-0000-0000-0000",
      {
        createdAt: "2025-03-01T00:00:00z",
        updatedAt: "2025-03-01T00:00:00z",
        userId: "0000-0000-0000-000",
      },
      {
        availableAt: "2025-03-01T00:00:00z",
        jobId: "0000-0000-0000-0001",
      },
    );
    expect(agentRuntime).toBeInstanceOf(AgentRunEntity);
  });

  it("[RECREATE] it must recreate a immutable instance of the class", () => {
    const agentRuntime = AgentRunEntity.recreate({
      artifacts: [],
      createdAt: "2025-03-01T00:00:00z",
      updatedAt: "2025-03-01T00:00:00z",
      currentStepIndex: 0,
      id: "0000-0000-0000-0000",
      plan: null,
      planning: null,
      status: "pending",
      userId: "0000-0000-0000-0000",
    });

    expect(agentRuntime).toBeInstanceOf(AgentRunEntity);
  });

  it("[UPDATE STATUS] it must update status of the class", () => {
    const agentRuntime = AgentRunEntity.recreate({
      artifacts: [],
      createdAt: "2025-03-01T00:00:00z",
      updatedAt: "2025-03-01T00:00:00z",
      currentStepIndex: 0,
      id: "0000-0000-0000-0000",
      plan: null,
      planning: null,
      status: "pending",
      userId: "0000-0000-0000-0000",
    });

    const agentRuntimeUpdated = agentRuntime.updateStatus({
      status: "canceled",
      updatedAt: "2025-03-01T01:00:00z",
    });

    console.log({
      updateAt: agentRuntimeUpdated.updatedAt,
      status: agentRuntimeUpdated.status,
    });

    expect({
      status: agentRuntimeUpdated.status,
      updatedAt: agentRuntimeUpdated.updatedAt,
    }).toStrictEqual({
      status: "canceled",
      updatedAt: "2025-03-01T01:00:00z",
    });
  });
});
