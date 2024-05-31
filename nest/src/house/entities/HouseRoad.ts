import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("house_road", { schema: "ka3" })
export class HouseRoad {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_road_id: number;

  @Column("varchar", { name: "name", length: 155 })
  house_road_name: string;

  @Column("int", { name: "capacity" })
  house_road_capacity: number;
}
