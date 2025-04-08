import { Column, Entity, PrimaryGeneratedColumn, Relation, OneToOne, JoinColumn } from "typeorm";
import { ActionQueue } from "./ActionQueue";

@Entity("action_cooldown", { schema: "ka3" })
export class ActionCooldown {
  protected action_cooldown_started_time_ago: string;
  protected action_cooldown_time_remaining: string;
  protected action_cooldown_finish_reason: string;
  protected action_cooldown_type_name: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  action_cooldown_id: number;

  @Column("int", { name: "queue_id" })
  action_cooldown_queue_id: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP", nullable: false })
  action_cooldown_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  action_cooldown_deleted_at: Date | null;
  
  @OneToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_action_cooldown)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_cooldown_queue: Relation<ActionQueue>;
}
