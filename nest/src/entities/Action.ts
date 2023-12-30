import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("action", { schema: "klofron-app-three" })
export class Action {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "person_id" })
  personId: number;

  @Column("int", { name: "type_id" })
  typeId: number;

  @Column("timestamp", { name: "started_at", nullable: true })
  startedAt: Date | null;

  @Column("timestamp", { name: "completed_at", nullable: true })
  completedAt: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  cancelledAt: Date | null;

  @Column("tinyint", { name: "infinite", width: 1, default: () => "'0'" })
  infinite: boolean;
}
