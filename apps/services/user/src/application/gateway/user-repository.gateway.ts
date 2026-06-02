import { type User } from "../../domain/entity/user/user.entity";
import { type Email } from "../../domain/value-object/email.value-object";

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User[] | null>;
  delete(id: string): Promise<void>;
}
