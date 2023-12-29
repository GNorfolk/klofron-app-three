import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Family } from "./Family";

@Index("username", ["username"], { unique: true })
@Index("email", ["email"], { unique: true })
@Index("family_id", ["familyId"], {})
@Entity("user", { schema: "klofron-app-three" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "username", unique: true, length: 155 })
  username: string;

  @Column("varchar", { name: "email", unique: true, length: 155 })
  email: string;

  @Column("varchar", { name: "password", length: 155 })
  password: string;

  @Column("int", { name: "family_id" })
  familyId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Family, (family) => family.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "id" }])
  family: Family;
}
