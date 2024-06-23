import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Relation,
  AfterLoad,
} from "typeorm";
import { Person } from "./Person"

@Entity("person_skills", { schema: "ka3" })
export class PersonSkills {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  person_skills_id: number;

  @Column("int", { name: "gatherer_experience" })
  person_skills_gatherer_experience: number;

  @Column("int", { name: "lumberjack_experience" })
  person_skills_lumberjack_experience: number;

  @Column("int", { name: "builder_experience" })
  person_skills_builder_experience: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  person_skills_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  person_skills_deleted_at: Date | null;

  @OneToOne(() => Person, (person) => person.person_skills)
  person_skills_person: Relation<Person>;

  @AfterLoad()
  calculateGathererLevel(): void {
    const float = Math.log(this.person_skills_gatherer_experience) / Math.log(2);
    this.person_skills_gatherer_level = float > 0 ? Math.floor(float) : 0;
  }
  person_skills_gatherer_level: number;

  @AfterLoad()
  calculateLumberjackLevel(): void {
    const float = Math.log(this.person_skills_lumberjack_experience) / Math.log(2);
    this.person_skills_lumberjack_level = float > 0 ? Math.floor(float) : 0;
  }
  person_skills_lumberjack_level: number;

  @AfterLoad()
  calculateBuilderLevel(): void {
    const float = Math.log(this.person_skills_builder_experience) / Math.log(2);
    this.person_skills_builder_level = float > 0 ? Math.floor(float) : 0;
  }
  person_skills_builder_level: number;
}