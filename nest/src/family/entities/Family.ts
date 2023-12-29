import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { House } from "../../house/entities/House";
import { Person } from "../../person/entities/Person";
import { User } from "../../../entities/User";

@Entity("family", { schema: "klofron-app-three" })
export class Family {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 155 })
  name: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => House, (house) => house.family)
  houses: House[];

  @OneToMany(() => Person, (person) => person.family)
  people: Person[];

  @OneToMany(() => User, (user) => user.family)
  users: User[];
}
