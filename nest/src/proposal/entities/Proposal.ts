import { Column, Entity, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Person } from "../../person/entities/Person";
import { ProposalOffer } from "../../proposal_offer/entities/ProposalOffer";

@Entity("proposal", { schema: "ka3" })
export class Proposal {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  proposal_id: number;

  @Column("int", { name: "person_id" })
  proposal_person_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  proposal_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  proposal_accepted_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  proposal_cancelled_at: Date | null;

  @ManyToOne(() => Person, (person) => person.person_proposals, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  proposal_person: Relation<Person>;

  @OneToMany(() => ProposalOffer, (proposal_offer) => proposal_offer.proposal_offer_proposal)
  proposal_offer_ids: Relation<ProposalOffer>[];
}
