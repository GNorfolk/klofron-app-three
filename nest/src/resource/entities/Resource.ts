import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { House } from "../../house/entities/House";
import { Person } from "../../person/entities/Person";

@Index("resource_ouse_id", ["resource_house_id"], {})
@Index("resource_person_id", ["resource_person_id"], {})
@Entity("resource", { schema: "ka3" })
export class Resource {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  resource_id: number;

  @Column("varchar", { name: "type_name", length: 155 })
  resource_type_name: string;

  @Column("int", { name: "volume" })
  resource_volume: number;

  @Column("int", { name: "house_id", nullable: true })
  resource_house_id: number | null;

  @Column("int", { name: "person_id", nullable: true })
  resource_person_id: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  resource_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  resource_deleted_at: Date | null;

  @ManyToOne(() => House, (house) => house.house_resources, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "house_id" }])
  resource_house: Relation<House>;

  @ManyToOne(() => Person, (person) => person.person_resources, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  resource_person: Relation<Person>;
}
