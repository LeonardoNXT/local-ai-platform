import { type OAuthFlowIntent } from "./oauth-flow-intent.type";

export type GoogleOAuthState = {
  intent: OAuthFlowIntent;
  createdAt: string;
};
