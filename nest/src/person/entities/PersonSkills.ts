import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("person_skills", { schema: "ka3" })
export class PersonSkills {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  person_skills_id: number;

  @Column("int", { name: "person_id" })
  person_skills_person_id: number;

  @Column("int", { name: "gatherer" })
  person_skills_gatherer: number;

  @Column("int", { name: "lumberjack" })
  person_skills_lumberjack: number;

  @Column("int", { name: "builder" })
  person_skills_builder: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  person_skills_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  person_skills_deleted_at: Date | null;
}
