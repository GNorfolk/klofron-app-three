import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { HexBonus } from "./HexBonus";
  
@Entity("hex", { schema: "ka3" })
export class Hex {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  hex_id: number;

  @Column("int", { name: "q_coordinate" })
  hex_q_coordinate: number;

  @Column("int", { name: "r_coordinate" })
  hex_r_coordinate: number;

  @Column("int", { name: "s_coordinate" })
  hex_s_coordinate: number;

  @Column("bool", { name: "land", default: "0" })
  hex_land: boolean;

  @OneToMany(() => HexBonus, (hexBonus) => hexBonus.hex_bonus_hex)
  hex_bonuses: HexBonus[];
}
  