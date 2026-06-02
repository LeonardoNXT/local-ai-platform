import { type HashedPassword } from "../value-object/hashed-password.value-object";
import { type Password } from "../value-object/password.value-object";

export interface PasswordHasher {
  hash(password: Password): Promise<HashedPassword>;
  compare(plainPassword: Password, hashed: HashedPassword): Promise<boolean>;
}
