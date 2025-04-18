import { Column, Entity, PrimaryGeneratedColumn, Relation, OneToOne, AfterLoad } from "typeorm";
import { ActionCooldown } from "./ActionCooldown";

@Entity("action_diceroll", { schema: "ka3" })
export class ActionDiceroll {
  protected action_diceroll_cooldown_hours: number;
  protected action_diceroll_success: boolean;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  action_diceroll_id: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP", nullable: false })
  action_diceroll_created_at: Date;

  @Column("int", { name: "black_roll" })
  action_diceroll_black_roll: number;

  @Column("int", { name: "skill_level" })
  action_diceroll_skill_level: number;

  @Column("int", { name: "red_roll" })
  action_diceroll_red_roll: number;

  @OneToOne(() => ActionCooldown, (action_cooldown) => action_cooldown.action_cooldown_diceroll)
  action_diceroll_action_cooldown: Relation<ActionCooldown>;

  @AfterLoad()
  calculateDicerollCooldownHours(): void {
    const diff = Math.floor((this.action_diceroll_black_roll + this.action_diceroll_skill_level - this.action_diceroll_red_roll) / 3)
    this.action_diceroll_cooldown_hours = diff > 0 ? 8 - diff : 8
  }

  @AfterLoad()
  calculateDicerollSuccess(): void {
    this.action_diceroll_success = this.action_diceroll_black_roll + this.action_diceroll_skill_level > this.action_diceroll_red_roll
  }
}
