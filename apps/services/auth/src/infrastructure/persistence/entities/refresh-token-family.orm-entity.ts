import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { DeviceOrmEntity } from "./device.orm-entity";
import { RefreshTokenOrmEntity } from "./refresh-token.orm-entity";
import { RefreshTokenFamilyStatus } from "../../../domain/enums/refresh-token-family-status";

@Entity("refresh_token_family")
export class RefreshTokenFamilyOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  user_id!: string;

  @Column({ name: "device_id", type: "uuid" })
  device_id!: string;

  @ManyToOne(() => DeviceOrmEntity, { nullable: false })
  @JoinColumn({ name: "device_id" })
  device!: DeviceOrmEntity;

  @OneToMany(() => RefreshTokenOrmEntity, (token) => token.refresh_token_family)
  tokens!: RefreshTokenOrmEntity[];

  @Column({
    name: "status",
    type: "enum",
    enum: RefreshTokenFamilyStatus,
    default: RefreshTokenFamilyStatus.ACTIVE,
  })
  status!: RefreshTokenFamilyStatus;

  @Column({ name: "refresh_round", type: "integer" })
  refresh_round!: number;

  @Column({ name: "revoked_reason", type: "varchar", nullable: true })
  revoked_reason!: string | null;

  @Column({ name: "expires_at", type: "timestamp" })
  expires_at!: Date;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revoked_at!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "edited_at", type: "timestamp", nullable: true })
  edited_at!: Date | null;
}
