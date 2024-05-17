import { Column, Entity, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn } from "typeorm";
import { Person } from "../../person/entities/Person";
import { Proposal } from "../../proposal/entities/Proposal";

@Entity("proposal_offer", { schema: "ka3" })
export class ProposalOffer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  proposal_offer_id: number;

  proposal_offer_proposal_id: number;

  @Column("int", { name: "person_id" })
  proposal_offer_person_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  proposal_offer_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  proposal_offer_accepted_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  proposal_offer_cancelled_at: Date | null;

  @ManyToOne(() => Proposal, (proposal) => proposal.proposal_offer_ids, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "proposal_id", referencedColumnName: "proposal_id" }])
  proposal_offer_proposal: Relation<Proposal>;

  @ManyToOne(() => Person, (person) => person.person_proposal_offers, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  proposal_offer_person: Relation<Person>;
}
