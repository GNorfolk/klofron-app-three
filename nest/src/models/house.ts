import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface houseAttributes {
    id?: number;
    name: string;
    rooms: number;
    storage: number;
    food?: number;
    wood?: number;
    familyId: number;
    createdAt?: Date;
    typeId: number;
    land: number;
}

@Table({ tableName: "house", timestamps: false })
export class house extends Model<houseAttributes, houseAttributes> implements houseAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ type: DataType.STRING(155) })
    name!: string;
    @Column({ type: DataType.INTEGER })
    rooms!: number;
    @Column({ type: DataType.INTEGER })
    storage!: number;
    @Column({ type: DataType.INTEGER, defaultValue: "0" })
    food?: number;
    @Column({ type: DataType.INTEGER, defaultValue: "0" })
    wood?: number;
    @Column({ field: "family_id", type: DataType.INTEGER })
    @Index({ name: "family_id", using: "BTREE", order: "ASC", unique: false })
    familyId!: number;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
    @Column({ field: "type_id", type: DataType.INTEGER })
    typeId!: number;
    @Column({ type: DataType.INTEGER })
    land!: number;
}