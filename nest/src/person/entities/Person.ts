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
import { Action } from "../../action/entities/Action";
import { Proposal } from "../../proposal/entities/Proposal";
import { ProposalOffer } from "../../proposal-offer/entities/ProposalOffer";
import { ProposalDowry } from "../../proposal-offer/entities/ProposalDowry";

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

  @ManyToOne(() => Person, (person) => person.person_id, { // Note: person.person_id can be person.person_father_id or person.person_family_id and it doesn't make a difference
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "father_id", referencedColumnName: "person_id" }])
  person_father: Relation<Person>;

  @ManyToOne(() => Person, (person) => person.person_id, { // Note: person.person_id can be person.person_mother_id or person.person_family_id and it doesn't make a difference
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "mother_id", referencedColumnName: "person_id" }])
  person_mother: Relation<Person>;

  @ManyToOne(() => Person, (person) => person.person_id, { // Note: person.person_id can be person.person_partner_id or person.person_family_id and it doesn't make a difference
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "partner_id", referencedColumnName: "person_id" }])
  person_partner: Relation<Person>;

  @OneToMany(() => Action, (action) => action.action_person)
  person_actions: Relation<Action>[];

  @OneToMany(() => Proposal, (proposal) => proposal.proposal_person)
  person_proposals: Relation<Proposal>[];

  @OneToMany(() => ProposalOffer, (proposal_offer) => proposal_offer.proposal_offer_person)
  person_proposal_offers: Relation<ProposalOffer>[];

  @OneToMany(() => ProposalDowry, (proposal_dowry) => proposal_dowry.proposal_dowry_person)
  person_proposal_dowrys: Relation<ProposalDowry>[];

  @OneToOne(() => Resource, (resource) => resource.resource_person)
  person_wood: Relation<Resource>;

  @OneToOne(() => Resource, (resource) => resource.resource_person)
  person_food: Relation<Resource>;

  @AfterLoad()
  calculateAge(): void {
    this.person_age = Math.floor(((new Date()).valueOf() - (new Date(this.person_created_at)).valueOf()) / day_in_ms);
  }
  person_age: number;
}
