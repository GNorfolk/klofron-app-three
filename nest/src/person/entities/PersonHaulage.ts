import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Relation,
  AfterLoad,
} from "typeorm";
import { Person } from "./Person"

@Entity("person_haulage", { schema: "ka3" })
export class PersonHaulage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  person_haulage_id: number;

  @Column("int", { name: "storage" })
  person_haulage_storage: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  person_haulage_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  person_haulage_deleted_at: Date | null;

  @OneToOne(() => Person, (person) => person.person_haulage)
  person_haulage_person: Relation<Person>;
}