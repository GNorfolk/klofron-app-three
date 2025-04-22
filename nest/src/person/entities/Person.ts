import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  AfterLoad,
  OneToOne,
} from "typeorm";
import { Family } from "../../family/entities/Family";
import { House } from "../../house/entities/House";
import { Resource } from "../../resource/entities/Resource";
import { ActionQueue } from "../../action/entities/ActionQueue";
import { PersonSkills } from "./PersonSkills"
import { Betrothal } from "src/betrothal/entities/Betrothal";
import { BetrothalDowry } from "src/betrothal/entities/BetrothalDowry";
import { PersonHaulage } from "./PersonHaulage";

const day_in_ms = 24 * 3600 * 1000

@Index("person_family_id", ["person_family_id"], {})
@Index("person_house_id", ["person_house_id"], {})
@Entity("person", { schema: "ka3" })
export class Person {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  person_id: number;

  @Column("varchar", { name: "name", length: 155 })
  person_name: string;

  @Column("int", { name: "family_id" })
  person_family_id: number;

  @Column("int", { name: "father_id" })
  person_father_id: number;

  @Column("int", { name: "mother_id" })
  person_mother_id: number;

  @Column("varchar", { name: "gender", length: 155 })
  person_gender: string;

  @Column("int", { name: "house_id", nullable: true })
  person_house_id: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  person_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  person_deleted_at: Date | null;

  @Column("int", { name: "partner_id", nullable: true })
  person_partner_id: number | null;

  @Column("int", { name: "teacher_id", nullable: true })
  person_teacher_id: number | null;

  @Column("int", { name: "action_queue_id" })
  person_action_queue_id: number;

  @ManyToOne(() => Family, (family) => family.family_people, { //////////////////////////
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "family_id" }])
  person_family: Relation<Family>;

  @ManyToOne(() => House, (house) => house.house_people, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "house_id" }])
  person_house: Relation<House>;

  @OneToMany(() => Resource, (resource) => resource.resource_person)
  person_resources: Relation<Resource>[];

  @ManyToOne(() => Person, (person) => person.person_id, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "father_id", referencedColumnName: "person_id" }])
  person_father: Relation<Person>;

  @ManyToOne(() => Person, (person) => person.person_id, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mother_id", referencedColumnName: "person_id" }])
  person_mother: Relation<Person>;

  @ManyToOne(() => Person, (person) => person.person_id, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "partner_id", referencedColumnName: "person_id" }])
  person_partner: Relation<Person>;

  @OneToMany(() => Person, (person) => person.person_teacher)
  person_students: Relation<Person>[];

  @ManyToOne(() => Person, (person) => person.person_students)
  @JoinColumn([{ name: "teacher_id", referencedColumnName: "person_id" }])
  person_teacher: Relation<Person>;

  @OneToOne(() => ActionQueue, (action_queue) => action_queue.action_queue_person)
  @JoinColumn([{ name: "action_queue_id", referencedColumnName: "action_queue_id" }])
  person_action_queue: Relation<ActionQueue>;

  @OneToMany(() => Betrothal, (betrothal) => betrothal.betrothal_proposer_person)
  person_betrothal_proposals: Relation<Betrothal>[];

  @OneToMany(() => Betrothal, (betrothal) => betrothal.betrothal_recipient_person)
  person_betrothal_receipts: Relation<Betrothal>[];
  
  @OneToMany(() => BetrothalDowry, (betrothal_dowry) => betrothal_dowry.betrothal_dowry_person)
  person_betrothal_dowrys: Relation<BetrothalDowry>[];

  @OneToOne(() => Resource, (resource) => resource.resource_person)
  person_wood: Relation<Resource>;

  @OneToOne(() => Resource, (resource) => resource.resource_person)
  person_food: Relation<Resource>;

  @Column("int", { name: "skills_id" })
  person_skills_id: number;

  @Column("int", { name: "haulage_id" })
  person_haulage_id: number;

  @OneToOne(() => PersonSkills, (personSkills) => personSkills.person_skills_person)
  @JoinColumn([{ name: "skills_id", referencedColumnName: "person_skills_id" }])
  person_skills: Relation<PersonSkills>;

  @OneToOne(() => PersonHaulage, (personHaulage) => personHaulage.person_haulage_person)
  @JoinColumn([{ name: "haulage_id", referencedColumnName: "person_haulage_id" }])
  person_haulage: Relation<PersonHaulage>;

  @AfterLoad()
  calculateAge(): void {
    this.person_age = Math.floor(((new Date()).valueOf() - (new Date(this.person_created_at)).valueOf()) / day_in_ms);
  }
  person_age: number;
}
