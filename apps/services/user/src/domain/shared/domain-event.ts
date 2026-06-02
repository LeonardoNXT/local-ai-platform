export type UserCreatedEventPayload = {
  email: string;
};

export type UserSuspendedEventPayload = {
  email: string;
};

export type UserDeactivatedEventPayload = {
  email: string;
};

export type UserBannedEventPayload = {
  email: string;
  reason: string;
};

export type UserReactivatedEventPayload = {
  email: string;
  reason: string;
};

export type UserEmailChangedEventPayload = {
  email: string;
};

export type UserPasswordChangedEventPayload = {
  email: string;
};

export type UserUsernameChangedEventPayload = {
  email: string;
};

export type DomainEventTypes =
  | "created"
  | "suspended"
  | "deactivated"
  | "banned"
  | "reactivated"
  | "emailChanged"
  | "passwordChanged"
  | "usernameChanged";

export interface DomainEvent {
  eventId: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: "user";
  eventType: DomainEventTypes;
  payload:
    | UserCreatedEventPayload
    | UserSuspendedEventPayload
    | UserDeactivatedEventPayload
    | UserBannedEventPayload
    | UserReactivatedEventPayload
    | UserEmailChangedEventPayload
    | UserUsernameChangedEventPayload;
}
