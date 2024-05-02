import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("move_house", { schema: "ka3" })
export class MoveHouse {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  move_house_id: number;

  @Column("int", { name: "person_id" })
  move_house_person_id: number;

  @Column("int", { name: "house_id" })
  move_house_house_id: number;

  @Column("timestamp", {
    name: "started_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  move_house_started_at: Date;

  @Column("timestamp", { name: "completed_at", nullable: true })
  move_house_completed_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  move_house_cancelled_at: Date | null;
}
