import { type AgentsTopics } from "./agents-runtime.contract";
import { type AuthTopics } from "./auth.contract";
import { type UserTopics } from "./user.contract";

export type EventTopics = AuthTopics | UserTopics | AgentsTopics;
