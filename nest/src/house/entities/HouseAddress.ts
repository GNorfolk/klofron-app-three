import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Relation,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { House } from "./House";
import { HouseRoad } from "./HouseRoad";

@Entity("house_address", { schema: "ka3" })
export class HouseAddress {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_address_id: number;

  @Column("int", { name: "number" })
  house_address_number: number;

  @Column("int", { name: "road_id" })
  house_address_road_id: number;

  @ManyToOne(() => HouseRoad, (houseRoad) => houseRoad.house_road_addresses)
  @JoinColumn([{ name: "road_id", referencedColumnName: "house_road_id" }])
  house_address_road: Relation<HouseRoad>;

  @OneToOne(() => House, (house) => house.house_address)
  house_address_house: Relation<House>;
}
