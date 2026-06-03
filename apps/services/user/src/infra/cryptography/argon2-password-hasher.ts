import { type PasswordHasher } from "../../domain/services/password-hasher";
import argon2 from "argon2";
import { HashedPassword } from "../../domain/value-object/hashed-password.value-object";
import { type Password } from "../../domain/value-object/password.value-object";
export class Argon2PasswordHasher implements PasswordHasher {
  async hash(password: Password): Promise<HashedPassword> {
    const hashed = await argon2.hash(password.getValue(), {
      type: argon2.argon2id,
    });

    return HashedPassword.create(hashed);
  }

  async compare(
    plainPassword: Password,
    hashed: HashedPassword,
  ): Promise<boolean> {
    return await argon2.verify(hashed.getValue(), plainPassword.getValue());
  }
}
