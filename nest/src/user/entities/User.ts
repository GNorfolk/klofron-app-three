import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Family } from "../../family/entities/Family";

@Index("user_username", ["user_username"], { unique: true })
@Index("user_email", ["user_email"], { unique: true })
@Index("user_family_id", ["user_family_id"], {})
@Entity("user", { schema: "ka3" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  user_id: number;

  @Column("varchar", { name: "username", unique: true, length: 155 })
  user_username: string;

  @Column("varchar", { name: "email", unique: true, length: 155 })
  user_email: string;

  @Column("varchar", { name: "password", length: 155 })
  _userpassword: string;

  @Column("int", { name: "family_id" })
  user_family_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  user_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  user_deleted_at: Date | null;

  @ManyToOne(() => Family, (family) => family.family_users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "family_id" }])
  user_family: Family;
}
