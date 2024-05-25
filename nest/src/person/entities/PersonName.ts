import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("person_name", { schema: "ka3" })
export class PersonName {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  person_name_id: number;

  @Column("varchar", { name: "name", length: 155 })
  person_name_name: string;

  @Column("varchar", { name: "gender", length: 155 })
  person_name_gender: string;
}
