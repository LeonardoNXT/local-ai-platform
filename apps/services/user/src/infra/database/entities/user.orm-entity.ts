import { Entity, Column, PrimaryColumn } from "typeorm";
import { UserStatus } from "../../../domain/entity/user/user.props";

@Entity("users")
export class UserOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, type: "citext", nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column("text", { array: true })
  passwordHistory: string[];

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: "date" })
  birthday: Date;

  @Column({ type: "timestamptz", nullable: true })
  deletedAt: Date | null;

  @Column({ type: "timestamptz" })
  createdAt: Date;

  @Column({ type: "timestamptz" })
  updatedAt: Date;
}
