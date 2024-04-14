import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("move_house", { schema: "ka3" })
export class MoveHouse {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "person_id" })
  personId: number;

  @Column("int", { name: "origin_house_id" })
  originHouseId: number;

  @Column("int", { name: "destination_house_id" })
  destinationHouseId: number;

  @Column("timestamp", {
    name: "started_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  startedAt: Date;

  @Column("timestamp", { name: "completed_at", nullable: true })
  completedAt: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  cancelledAt: Date | null;
}
