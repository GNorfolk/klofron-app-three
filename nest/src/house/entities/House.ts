import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Family } from "../../family/entities/Family";
import { Person } from "../../person/entities/Person";
import { Resource } from "../../resource/entities/Resource";
import { Trade } from "../../trade/entities/Trade";

@Index("house_family_id", ["house_family_id"], {})
@Entity("house", { schema: "klofron-app-three" })
export class House {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_id: number;

  @Column("varchar", { name: "name", length: 155 })
  house_name: string;

  @Column("int", { name: "rooms" })
  house_rooms: number;

  @Column("int", { name: "storage" })
  house_storage: number;

  @Column("int", { name: "food", default: () => "'0'" })
  house_food: number;

  @Column("int", { name: "wood", default: () => "'0'" })
  house_wood: number;

  @Column("int", { name: "family_id" })
  house_family_id: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  house_created_at: Date;

  @Column("int", { name: "type_id" })
  house_type_id: number;

  @Column("int", { name: "land" })
  house_land: number;

  @ManyToOne(() => Family, (family) => family.houses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "family_id" }])
  family: Relation<Family>;

  @OneToMany(() => Person, (person) => person.house)
  people: Relation<Person>[];

  @OneToMany(() => Resource, (resource) => resource.house)
  resources: Relation<Resource>[];

  @OneToMany(() => Trade, (trade) => trade.house)
  trades: Relation<Trade>[];
}
