import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { House } from "../../house/entities/House";

@Index("trade_house_id", ["trade_house_id"], {})
@Entity("trade", { schema: "klofron-app-three" })
export class Trade {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  trade_id: number;

  @Column("int", { name: "house_id" })
  trade_house_id: number;

  @Column("int", { name: "offered_type_id" })
  trade_offered_type_id: number;

  @Column("int", { name: "offered_volume" })
  trade_offered_volume: number;

  @Column("int", { name: "requested_type_id" })
  trade_requested_type_id: number;

  @Column("int", { name: "requested_volume" })
  trade_requested_volume: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  trade_created_at: Date;

  @Column("timestamp", { name: "completed_at", nullable: true })
  trade_completed_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  trade_cancelled_at: Date | null;

  @ManyToOne(() => House, (house) => house.house_trades, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "house_id", referencedColumnName: "house_id" }])
  trade_house: House;
}
