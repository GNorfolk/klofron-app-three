import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("house_road_name", { schema: "ka3" })
export class HouseRoadName {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_road_name_id: number;

  @Column("varchar", { name: "name", length: 155 })
  house_road_name_name: string;

  @Column("varchar", { name: "theme", length: 155 })
  house_road_name_theme: string;
}
