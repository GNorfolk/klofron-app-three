import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Family } from "../../family/entities/Family";
import { House } from "../../house/entities/House";
import { Resource } from "../../resource/entities/Resource";

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
  family: Relation<Family>;

  @ManyToOne(() => House, (house) => house.people, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: Relation<House>;

  @OneToMany(() => Resource, (resource) => resource.person)
  resources: Relation<Resource>[];
}
