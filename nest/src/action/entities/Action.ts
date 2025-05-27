import { Column, Entity, PrimaryGeneratedColumn, AfterLoad, Relation, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { ActionQueue } from "./ActionQueue";

const day_in_ms = 24 * 3600 * 1000
const hour_in_ms = 3600 * 1000

@Entity("action", { schema: "ka3" })
export class Action {
  protected action_started_time_ago: string;
  protected action_time_remaining: string;
  protected action_finish_reason: string;
  protected action_type_name: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  action_id: number;

  @Column("int", { name: "queue_id" })
  action_queue_id: number;

  @Column("int", { name: "type_id" })
  action_type_id: number;

  @Column("int", { name: "experience_multiplier" })
  action_experience_multiplier: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP", nullable: false })
  action_created_at: Date;

  @Column("timestamp", { name: "started_at", nullable: true })
  action_started_at: Date;

  @Column("timestamp", { name: "completed_at", nullable: true })
  action_completed_at: Date | null;

  @Column("timestamp", { name: "cancelled_at", nullable: true })
  action_cancelled_at: Date | null;

  @Column("tinyint", { name: "infinite", width: 1, default: () => "'0'" })
  action_infinite: boolean;

  @ManyToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_previous_actions)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_queue_previous: Relation<ActionQueue>;

  @OneToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_current_action)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_queue_current: Relation<ActionQueue>;

  @ManyToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_next_actions)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_queue_next: Relation<ActionQueue>;

  @ManyToOne(() => ActionQueue, (actionQueue) => actionQueue.action_queue_actions)
  @JoinColumn([{ name: "queue_id", referencedColumnName: "action_queue_id" }])
  action_queue: Relation<ActionQueue>;

  @AfterLoad()
  calculateActionStartedTimeAgo(): void {
    if (this.action_started_at) {
      const days = ( (new Date()).valueOf() - (new Date(this.action_started_at)).valueOf()) / day_in_ms;
      const hours = days > 1 ? (days - Math.floor(days)) * 24 : days * 24;
      const minutes = hours > 1 ? (hours - Math.floor(hours)) * 60 : hours * 60;
      this.action_started_time_ago = Math.floor(days) + "days " + Math.floor(hours) + "hrs " + Math.floor(minutes) + "mins";
    } else {
      this.action_started_time_ago = null;
    }
  }

  @AfterLoad()
  calculateActionTimeRemaining(): void {
    const hours = ((new Date(this.action_started_at)).valueOf() - (new Date().valueOf() - (8 * hour_in_ms)).valueOf()) / hour_in_ms
    const minutes = hours > 1 ?  (hours - Math.floor(hours)) * 60 : hours * 60
    if (hours >= 0 && minutes >= 0 && this.action_completed_at == null && this.action_cancelled_at == null)  {
      this.action_time_remaining = Math.floor(hours) + "hrs " + Math.floor(minutes) + "mins"
    } else {
      this.action_time_remaining = null
    }
  }

  @AfterLoad()
  calculateActionFinishReason(): void {
    this.action_finish_reason = this.action_completed_at != null ? "Completed" : this.action_cancelled_at != null ? "Cancelled" : null
  }

  @AfterLoad()
  calculateActionTypeName(): void {
    switch(this.action_type_id) {
      case 1: { this.action_type_name = "Get Berry"; break }
      case 2: { this.action_type_name = "Get Birch"; break }
      case 3: { this.action_type_name = "Increase Storage"; break }
      case 4: { this.action_type_name = "Increase Rooms"; break }
      case 5: { this.action_type_name = "Create House"; break }
      case 6: { this.action_type_name = "Create Baby"; break }
      case 7: { this.action_type_name = "Teach Students"; break }
      default: { this.action_type_name = "Unknown"; break }
    }
  }
}
