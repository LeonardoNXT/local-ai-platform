export enum UserTopics {
  CREATED = "user.created",
  SUSPENDED = "user.suspended",
  DEACTIVATED = "user.deactivated",
  BANNED = "user.banned",
  REACTIVATED = "user.reactivated",
  EMAIL_CHANGED = "user.emailChanged",
  PASSWORD_CHANGED = "user.passwordChanged",
  USERNAME_CHANGED = "user.usernameChanged",
}

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

export interface UserKafkaTopics {
  USER_CREATED: "user.created";
  USER_SUSPENDED: "user.suspended";
  USER_DEACTIVATED: "user.deactivated";
  USER_BANNED: "user.banned";
  USER_REACTIVATED: "user.reactivated";
  USER_EMAIL_CHANGED: "user.emailChanged";
  USER_PASSWORD_CHANGED: "user.passwordChanged";
  USER_USERNAME: "user.usernameChanged";
}
