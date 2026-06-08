import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("oauth_accounts")
export class OAuthAccountsOrmEntity {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
  userId!: string;

  @Column({ type: "varchar", name: "provider", nullable: false })
  provider!: string;

  @Column({
    type: "varchar",
    name: "provider_account_id",
    nullable: false,
    unique: true,
  })
  providerAccountId!: string;

  @Column({ type: "timestamp", name: "created_at", nullable: false })
  createdAt!: string;
}
