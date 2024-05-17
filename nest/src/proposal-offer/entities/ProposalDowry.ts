import { Column, Entity, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Person } from "../../person/entities/Person";
import { ProposalOffer } from "./ProposalOffer";

@Entity("proposal_dowry", { schema: "ka3" })
export class ProposalDowry {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  proposal_dowry_id: number;

  @Column("int", { name: "person_id" })
  proposal_dowry_person_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  proposal_dowry_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  proposal_dowry_accepted_at: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  proposal_dowry_deleted_at: Date | null;

  @ManyToOne(() => Person, (person) => person.person_proposal_dowrys, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  proposal_dowry_person: Relation<Person>;

  @OneToOne(() => ProposalOffer, (proposalOffer) => proposalOffer.proposal_offer_dowry)
  proposal_dowry_offer: Relation<ProposalDowry>;
}
