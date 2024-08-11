import { Column, Entity, PrimaryGeneratedColumn, Relation, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Person } from "../../person/entities/Person";
import { Action } from "./Action";

@Entity("action_queue", { schema: "ka3" })
export class ActionQueue {
  protected action_queue_started_time_ago: string;
  protected action_queue_time_remaining: string;
  protected action_queue_finish_reason: string;
  protected action_queue_type_name: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  action_queue_id: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP", nullable: false })
  action_queue_created_at: Date;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  action_queue_deleted_at: Date | null;

  @OneToOne(() => Person, (person) => person.person_action_queue)
  action_queue_person: Relation<Person>;

  @OneToMany(() => Action, (action) => action.action_queue_previous)
  action_queue_previous_actions: Relation<Action>[];

  @OneToOne(() => Action, (action) => action.action_queue_current)
  action_queue_current_action: Relation<Action>;

  @OneToMany(() => Action, (action) => action.action_queue_next)
  action_queue_next_actions: Relation<Action>[];
}
