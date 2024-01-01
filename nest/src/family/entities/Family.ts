import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { House } from "../../house/entities/House";
import { Person } from "../../person/entities/Person";
import { User } from "../../user/entities/User";

@Entity("family", { schema: "klofron-app-three" })
export class Family {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  family_id: number;

  @Column("varchar", { name: "name", length: 155 })
  family_name: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  family_created_at: Date;

  @OneToMany(() => House, (house) => house.family)
  houses: Relation<House>[];

  @OneToMany(() => Person, (person) => person.family)
  people: Relation<Person>[];

  @OneToMany(() => User, (user) => user.family)
  users: Relation<User>[];
}
