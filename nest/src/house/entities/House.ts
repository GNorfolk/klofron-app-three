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
import { HouseAddress } from "./HouseAddress";
import { Hex } from "src/hex/entities/Hex";

@Index("house_family_id", ["house_family_id"], {})
@Entity("house", { schema: "ka3" })
export class House {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  house_id: number;

  @Column("int", { name: "rooms", default: () => 1, })
  house_rooms: number;

  @Column("int", { name: "storage", default: () => 6, })
  house_storage: number;

  @Column("int", { name: "family_id" })
  house_family_id: number;

  @Column("int", { name: "address_id" })
  house_address_id: number;

  @Column("int", { name: "hex_id", nullable: false })
  house_hex_id: number;

  @ManyToOne(() => Hex)
  @JoinColumn({ name: 'hex_id' }) // maps foreign key to Hex.id
  house_hex: Hex;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  house_created_at: Date;

  @Column("timestamp", { name: "deleted_at" })
  house_deleted_at: Date;

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

  @OneToOne(() => HouseAddress, (houseAddress) => houseAddress.house_address_house)
  @JoinColumn([{ name: "address_id", referencedColumnName: "house_address_id" }])
  house_address: Relation<HouseAddress>;
}
