import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation, ManyToOne, JoinColumn } from "typeorm";
import { House } from "../../house/entities/House";
import { Person } from "../../person/entities/Person";
import { User } from "../../user/entities/User";

@Entity("family", { schema: "ka3" })
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

  @OneToMany(() => House, (house) => house.house_family)
  family_houses: Relation<House>[];

  @OneToMany(() => Person, (person) => person.person_family)
  family_people: Relation<Person>[];

  @Column("int", { name: "user_id" })
  family_user_id: number;

  @ManyToOne(() => User, (user) => user.user_families, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "user_id" }])
  family_user: User;
}
