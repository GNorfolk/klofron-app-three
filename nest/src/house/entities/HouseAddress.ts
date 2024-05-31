import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Relation
} from "typeorm";
import { House } from "./House";

@Entity("house_address", { schema: "ka3" })
export class HouseAddress {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_address_id: number;

  @Column("int", { name: "number" })
  house_address_number: number;

  @Column("int", { name: "road_id" })
  house_address_road_id: number;

  @OneToOne(() => House, (house) => house.house_address)
  house_address_house: Relation<House>;
}
