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

@Index("family_id", ["familyId"], {})
@Entity("house", { schema: "klofron-app-three" })
export class House {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 155 })
  name: string;

  @Column("int", { name: "rooms" })
  rooms: number;

  @Column("int", { name: "storage" })
  storage: number;

  @Column("int", { name: "food", default: () => "'0'" })
  food: number;

  @Column("int", { name: "wood", default: () => "'0'" })
  wood: number;

  @Column("int", { name: "family_id" })
  familyId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("int", { name: "type_id" })
  typeId: number;

  @Column("int", { name: "land" })
  land: number;

  @ManyToOne(() => Family, (family) => family.houses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "family_id", referencedColumnName: "id" }])
  family: Relation<Family>;

  @OneToMany(() => Person, (person) => person.house)
  people: Relation<Person>[];

  @OneToMany(() => Resource, (resource) => resource.house)
  resources: Relation<Resource>[];

  @OneToMany(() => Trade, (trade) => trade.house)
  trades: Relation<Trade>[];
}
