import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("house_road_type", { schema: "ka3" })
export class HouseRoadType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_road_type_id: number;

  @Column("varchar", { name: "name", length: 155 })
  house_road_type_name: string;

  @Column("int", { name: "capacity" })
  house_road_type_capacity: number;
}
