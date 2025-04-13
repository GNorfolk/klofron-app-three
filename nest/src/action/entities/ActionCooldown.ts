import { Column, Entity, PrimaryGeneratedColumn, Relation, OneToOne, JoinColumn, AfterLoad } from "typeorm";
import { ActionQueue } from "./ActionQueue";

const hour_in_ms = 3600 * 1000

@Entity("action_cooldown", { schema: "ka3" })
export class ActionCooldown {
  protected action_cooldown_time_remaining: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  action_cooldown_id: number;

  @Column("int", { name: "queue_id" })
  action_cooldown_queue_id: number;

  @Column("int", { name: "duration_hours" })
  action_cooldown_duration_hours: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP", nullable: false })
  action_cooldown_created_at: Date;

  @Column("timestamp", { name: "done_at", nullable: false })
  action_cooldown_done_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  action_cooldown_deleted_at: Date | null;
  
  @OneToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_action_cooldown)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_cooldown_queue: Relation<ActionQueue>;

  @AfterLoad()
  calculateActionTimeRemaining(): void {
    const hours = ((new Date(this.action_cooldown_created_at)).valueOf() - (new Date().valueOf() - (8 * hour_in_ms)).valueOf()) / hour_in_ms
    const minutes = hours > 1 ?  (hours - Math.floor(hours)) * 60 : hours * 60
    if (hours >= 0 && minutes >= 0 && this.action_cooldown_deleted_at == null)  {
      this.action_cooldown_time_remaining = Math.floor(hours) + "hrs " + Math.floor(minutes) + "mins"
    } else {
      this.action_cooldown_time_remaining = null
    }
  }
}
