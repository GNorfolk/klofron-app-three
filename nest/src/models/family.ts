import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface familyAttributes {
    id?: number;
    name: string;
    createdAt?: Date;
}

@Table({ tableName: "family", timestamps: false })
export class family extends Model<familyAttributes, familyAttributes> implements familyAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ type: DataType.STRING(155) })
    name!: string;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
}