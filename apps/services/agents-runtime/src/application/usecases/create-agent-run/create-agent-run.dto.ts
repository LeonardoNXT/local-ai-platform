export type CreateAgentRunInputDto = {
  userId: string;
  input_id: string;
  input: string;
};
export type CreateAgentRunOutputDto = {
  runId: string;
  createdAt: string;
};
