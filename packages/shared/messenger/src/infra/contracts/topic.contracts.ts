import { type AuthTopics } from "./auth.contract";
import { type UserTopics } from "./user.contract";

export type EventTopics = AuthTopics | UserTopics;
