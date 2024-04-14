import {
  Column,
  Entity,
  Index,
  OneToMany,
  Relation,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Family } from "../../family/entities/Family";

@Index("user_username", ["user_username"], { unique: true })
@Index("user_email", ["user_email"], { unique: true })
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

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  user_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  user_deleted_at: Date | null;

  @OneToMany(() => Family, (family) => family.family_user)
  user_families: Relation<Family>[];
}
