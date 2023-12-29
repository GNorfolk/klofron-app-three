import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Family } from "./Family";
import { House } from "./House";
import { Resource } from "./Resource";

@Index("family_id", ["familyId"], {})
@Index("house_id", ["houseId"], {})
@Entity("person", { schema: "klofron-app-three" })
export class Person {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 155 })
  name: string;

  @Column("int", { name: "family_id" })
  familyId: number;

  @Column("int", { name: "father_id" })
  fatherId: number;

  @Column("int", { name: "mother_id" })
  motherId: number;

  @Column("varchar", { name: "gender", length: 155 })
  gender: string;

  @Column("int", { name: "house_id", nullable: true })
  houseId: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("int", { name: "partner_id", nullable: true })
  partnerId: number | null;

  @ManyToOne(() => Family, (family) => family.people, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "id" }])
  family: Family;

  @ManyToOne(() => House, (house) => house.people, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: House;

  @OneToMany(() => Resource, (resource) => resource.person)
  resources: Resource[];
}
