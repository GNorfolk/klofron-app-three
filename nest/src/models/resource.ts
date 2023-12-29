import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface resourceAttributes {
    id?: number;
    typeName: string;
    volume: number;
    houseId?: number;
    personId?: number;
    createdAt?: Date;
    deletedAt?: Date;
}

@Table({ tableName: "resource", timestamps: false })
export class resource extends Model<resourceAttributes, resourceAttributes> implements resourceAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ field: "type_name", type: DataType.STRING(155) })
    typeName!: string;
    @Column({ type: DataType.INTEGER })
    volume!: number;
    @Column({ field: "house_id", allowNull: true, type: DataType.INTEGER })
    @Index({ name: "house_id", using: "BTREE", order: "ASC", unique: false })
    houseId?: number;
    @Column({ field: "person_id", allowNull: true, type: DataType.INTEGER })
    @Index({ name: "person_id", using: "BTREE", order: "ASC", unique: false })
    personId?: number;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
    @Column({ field: "deleted_at", allowNull: true, type: DataType.DATE })
    deletedAt?: Date;
}