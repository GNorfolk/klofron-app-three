import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Hex } from "./Hex";

export enum HexBonusType {
  BAMBOO = 'bamboo',
  BERRY = 'berry',
  FLINT = 'flint',
}
  
@Entity("hex_bonus", { schema: "ka3" })
export class HexBonus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  hex_bonus_id: number;

  @Column("int", { name: "hex_id", nullable: false })
  hex_bonus_hex_id: number;

  @ManyToOne(() => Hex)
  @JoinColumn({ name: 'hex_id' })
  hex_bonus_hex: Hex;

  @Column({
    type: 'enum',
    name: "type",
    enum: HexBonusType,
    nullable: false,
  })
  hex_bonus_type: HexBonusType;

  @Column("int", { name: "value", nullable: false })
  hex_bonus_value: number;
}
