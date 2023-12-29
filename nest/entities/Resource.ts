import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { House } from "./House";
import { Person } from "./Person";

@Index("house_id", ["houseId"], {})
@Index("person_id", ["personId"], {})
@Entity("resource", { schema: "klofron-app-three" })
export class Resource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "type_name", length: 155 })
  typeName: string;

  @Column("int", { name: "volume" })
  volume: number;

  @Column("int", { name: "house_id", nullable: true })
  houseId: number | null;

  @Column("int", { name: "person_id", nullable: true })
  personId: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => House, (house) => house.resources, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "id" }])
  house: House;

  @ManyToOne(() => Person, (person) => person.resources, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "person_id", referencedColumnName: "id" }])
  person: Person;
}
