import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { RefreshTokenFamilyOrmEntity } from "./refresh-token-family.orm-entity";
import { RefreshTokenStatus } from "../../../domain/enums/refresh-token-status";

@Entity("refresh_token")
export class RefreshTokenOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "token_hash", type: "text" })
  token_hash!: string;

  @Column({ name: "user_id", type: "uuid" })
  user_id!: string;

  @Column({ name: "user_id", type: "uuid" })
  user!: string;

  @Column({ name: "latest", type: "boolean" })
  latest!: boolean;

  @Column({
    name: "status",
    type: "enum",
    enum: RefreshTokenStatus,
    default: RefreshTokenStatus.ACTIVE,
  })
  status!: RefreshTokenStatus;

  @Column({ name: "refresh_token_family_id", type: "uuid" })
  refresh_token_family_id!: string;

  @ManyToOne(() => RefreshTokenFamilyOrmEntity, { nullable: false })
  @JoinColumn({ name: "refresh_token_family_id" })
  refresh_token_family!: RefreshTokenFamilyOrmEntity;

  @Column({ name: "refresh_round", type: "integer" })
  refresh_round!: number;

  @Column({ name: "previous_refresh_token_id", type: "uuid", nullable: true })
  previous_refresh_token_id!: string | null;

  @ManyToOne(() => RefreshTokenOrmEntity, { nullable: true })
  @JoinColumn({ name: "previous_refresh_token_id" })
  previous_refresh_token!: RefreshTokenOrmEntity | null;

  @Column({
    name: "replaced_by_refresh_token_id",
    type: "uuid",
    nullable: true,
  })
  replaced_by_refresh_token_id!: string | null;

  @ManyToOne(() => RefreshTokenOrmEntity, { nullable: true })
  @JoinColumn({ name: "replaced_by_refresh_token_id" })
  replaced_by_refresh_token!: RefreshTokenOrmEntity | null;

  @Column({ name: "expires_at", type: "timestamp" })
  expires_at!: Date;

  @Column({ name: "used_at", type: "timestamp", nullable: true })
  used_at!: Date | null;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revoked_at!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "edited_at", type: "timestamp", nullable: true })
  edited_at!: Date | null;
}
