export type AuthenticatedUser = {
  id: string;
};

export abstract class UserProviderPort {
  abstract validateCredentials(input: {
    email: string;
    password: string;
  }): Promise<AuthenticatedUser | null>;
}
