import { Column, Entity, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Person } from "../../person/entities/Person";
import { BetrothalDowry } from "./BetrothalDowry";

@Entity("betrothal", { schema: "ka3" })
export class Betrothal {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  betrothal_id: number;

  @Column("int", { name: "proposer_person_id" })
  betrothal_proposer_person_id: number;

  @Column("int", { name: "recipient_person_id" })
  betrothal_recipient_person_id: number;

  @Column("int", { name: "dowry_id" })
  betrothal_dowry_id: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  betrothal_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  betrothal_accepted_at: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  betrothal_deleted_at: Date | null;

  @ManyToOne(() => Person, (person) => person.person_betrothal_proposals)
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  betrothal_proposer_person: Relation<Person>;

  @ManyToOne(() => Person, (person) => person.person_betrothal_receipts)
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  betrothal_recipient_person: Relation<Person>;

  @OneToOne(() => BetrothalDowry, (betrothalDowry) => betrothalDowry.betrothal_dowry_betrothal)
  @JoinColumn([{ name: "dowry_id", referencedColumnName: "proposal_dowry_id" }])
  betrothal_dowry: Relation<BetrothalDowry>;
}
