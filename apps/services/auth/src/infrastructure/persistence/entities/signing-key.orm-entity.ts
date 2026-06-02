import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("signing_keys")
export class SigningKeyOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ unique: true })
  kid!: string;

  @Column({ name: "algorithm", default: "RS256" })
  algorithm!: string;

  @Column({ name: "public_key_pem", type: "text" })
  publicKeyPem!: string;

  @Column({ name: "private_key_pem", type: "text" })
  privateKeyPem!: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
