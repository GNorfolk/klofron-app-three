import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("proposal", { schema: "klofron-app-three" })
export class Proposal {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  proposal_id: number;

  @Column("int", { name: "proposer_person_id" })
  proposal_proposer_person_id: number;

  @Column("int", { name: "accepter_person_id", nullable: true })
  proposal_accepter_person_id: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  proposal_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  proposal_accepted_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  proposal_cancelled_at: Date | null;
}
