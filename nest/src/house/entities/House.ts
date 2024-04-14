import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  OneToOne,
} from "typeorm";
import { Family } from "../../family/entities/Family";
import { Person } from "../../person/entities/Person";
import { Resource } from "../../resource/entities/Resource";
import { Trade } from "../../trade/entities/Trade";

@Index("house_family_id", ["house_family_id"], {})
@Entity("house", { schema: "ka3" })
export class House {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_id: number;

  @Column("varchar", { name: "name", length: 155 })
  house_name: string;

  @Column("int", { name: "rooms" })
  house_rooms: number;

  @Column("int", { name: "storage" })
  house_storage: number;

  @Column("int", { name: "family_id" })
  house_family_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  house_created_at: Date;

  // @Column("int", { name: "type_id" })
  // house_type_id: number;

  // @Column("int", { name: "land" })
  // house_land: number;

  @ManyToOne(() => Family, (family) => family.family_houses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "family_id" }])
  house_family: Relation<Family>;

  @OneToMany(() => Person, (person) => person.person_house)
  house_people: Relation<Person>[];

  @OneToMany(() => Resource, (resource) => resource.resource_house)
  house_resources: Relation<Resource>[];

  @OneToOne(() => Resource, (resource) => resource.resource_house)
  house_wood: Relation<Resource>;

  @OneToOne(() => Resource, (resource) => resource.resource_house)
  house_food: Relation<Resource>;

  @OneToMany(() => Trade, (trade) => trade.trade_house)
  house_trades: Relation<Trade>[];
}
