import { Argon2PasswordHasher } from "../../infra/cryptography/argon2-password-hasher";

export class ServicesInitializer {
  public static all() {
    const passwordHasher = new Argon2PasswordHasher();

    return {
      passwordHasher,
    };
  }
}
