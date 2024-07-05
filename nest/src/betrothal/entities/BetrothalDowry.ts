import { Column, Entity, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Person } from "../../person/entities/Person";
import { Betrothal } from "./Betrothal";

@Entity("betrothal_dowry", { schema: "ka3" })
export class BetrothalDowry {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  betrothal_dowry_id: number;

  @Column("int", { name: "person_id" })
  betrothal_dowry_person_id: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  betrothal_dowry_created_at: Date;

  @Column("timestamp", { name: "accepted_at", nullable: true })
  betrothal_dowry_accepted_at: Date | null;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  betrothal_dowry_deleted_at: Date | null;

  @ManyToOne(() => Person, (person) => person.person_betrothal_dowrys)
  @JoinColumn([{ name: "person_id", referencedColumnName: "person_id" }])
  betrothal_dowry_person: Relation<Person>;

  @OneToOne(() => Betrothal, (betrothal) => betrothal.betrothal_dowry)
  betrothal_dowry_betrothal: Relation<Betrothal>;
}
