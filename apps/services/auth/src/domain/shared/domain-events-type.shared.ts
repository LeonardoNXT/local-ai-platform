export type RefreshTokenEventsType = "created" | "revoked" | "rotated";
export type OAuthEventsType =
  | "oauth.login"
  | "oauth.removed"
  | "oauth.connected";

export type EventType = RefreshTokenEventsType | OAuthEventsType;

export type RefreshTokenEventPayload = {
  userId: string;
  refreshTokenId: string;
};

export type OAuthEventPayload = {
  userId: string;
  provider: string;
  providerAccountId: string;
};

export type EventPayload = RefreshTokenEventPayload | OAuthEventPayload;

export interface DomainEventType {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: "auth";
  eventType: EventType;
  payload: EventPayload;
}
