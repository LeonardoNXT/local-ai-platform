import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("device")
export class DeviceOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  user_id!: string;

  @Column({ name: "name", type: "varchar", nullable: true })
  name!: string | null;

  @Column({ name: "type", type: "varchar", nullable: true })
  type!: string | null;

  @Column({ name: "region", type: "varchar", nullable: true })
  region!: string | null;

  @Column({ name: "city", type: "varchar", nullable: true })
  city!: string | null;

  @Column({ name: "country", type: "varchar", nullable: true })
  country!: string | null;

  @Column({ name: "countryCode", type: "varchar", nullable: true })
  countryCode!: string | null;

  @Column({ name: "user_agent", type: "varchar" })
  user_agent!: string;

  @Column({ name: "last_seen_at", type: "timestamp", nullable: true })
  last_seen_at!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ name: "edited_at", type: "timestamp", nullable: true })
  edited_at!: Date | null;
}
