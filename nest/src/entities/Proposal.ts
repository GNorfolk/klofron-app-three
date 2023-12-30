import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("proposal", { schema: "klofron-app-three" })
export class Proposal {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "proposer_person_id" })
  proposerPersonId: number;

  @Column("int", { name: "accepter_person_id", nullable: true })
  accepterPersonId: number | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  acceptedAt: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  cancelledAt: Date | null;
}
