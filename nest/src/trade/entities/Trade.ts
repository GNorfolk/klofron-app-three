import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { House } from "../../house/entities/House";

@Index("house_id", ["houseId"], {})
@Entity("trade", { schema: "klofron-app-three" })
export class Trade {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "house_id" })
  houseId: number;

  @Column("int", { name: "offered_type_id" })
  offeredTypeId: number;

  @Column("int", { name: "offered_volume" })
  offeredVolume: number;

  @Column("int", { name: "requested_type_id" })
  requestedTypeId: number;

  @Column("int", { name: "requested_volume" })
  requestedVolume: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", { name: "completed_at", nullable: true })
  completedAt: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  cancelledAt: Date | null;

  @ManyToOne(() => House, (house) => house.trades, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "house_id" }])
  house: House;
}
