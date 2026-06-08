export type AuthenticatedUser = {
  id: string;
};

export type RegisterProps = {
  name: string;
  username: string;
  email: string;
  birthday: string;
  password: string;
  isEmailVerified: boolean;
};

export abstract class UserProviderPort {
  abstract validateCredentials(input: {
    email: string;
    password: string;
  }): Promise<AuthenticatedUser | null>;
  abstract register(input: RegisterProps): Promise<AuthenticatedUser | null>;
}
