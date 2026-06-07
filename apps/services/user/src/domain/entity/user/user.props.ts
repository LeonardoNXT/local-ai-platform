import { type Birthday } from "../../value-object/birthday.value-object";
import { type Email } from "../../value-object/email.value-object";
import { type HashedPassword } from "../../value-object/hashed-password.value-object";
import { type Name } from "../../value-object/name.value-object";
import { type Status } from "../../value-object/status.value-object";

export enum UserStatus {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
  BANNED = "banned",
  SUSPENDED = "suspended",
}

export type UserProps = {
  id: string;
  username: Name;
  name: Name;
  email: Email;
  hashedPassword: HashedPassword;
  status: Status;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  passwordHistory: HashedPassword[];
  birthday: Birthday;
  isEmailVerified: boolean;
};

export type CreateUserProps = Omit<
  UserProps,
  "id" | "passwordHistory" | "status" | "deletedAt" | "createdAt" | "updatedAt"
>;
