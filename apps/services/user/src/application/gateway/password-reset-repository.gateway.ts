export interface PasswordResetTokenRepository {
  save(token: string, userId: string, ttl: number): Promise<void>;
  find(token: string): Promise<string | null>;
  delete(token: string): Promise<void>;
}
