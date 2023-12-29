import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface personAttributes {
    id?: number;
    name: string;
    familyId: number;
    fatherId: number;
    motherId: number;
    gender: string;
    houseId?: number;
    createdAt?: Date;
    deletedAt?: Date;
    partnerId?: number;
}

@Table({ tableName: "person", timestamps: false })
export class person extends Model<personAttributes, personAttributes> implements personAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ type: DataType.STRING(155) })
    name!: string;
    @Column({ field: "family_id", type: DataType.INTEGER })
    @Index({ name: "family_id", using: "BTREE", order: "ASC", unique: false })
    familyId!: number;
    @Column({ field: "father_id", type: DataType.INTEGER })
    fatherId!: number;
    @Column({ field: "mother_id", type: DataType.INTEGER })
    motherId!: number;
    @Column({ type: DataType.STRING(155) })
    gender!: string;
    @Column({ field: "house_id", allowNull: true, type: DataType.INTEGER })
    @Index({ name: "house_id", using: "BTREE", order: "ASC", unique: false })
    houseId?: number;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
    @Column({ field: "deleted_at", allowNull: true, type: DataType.DATE })
    deletedAt?: Date;
    @Column({ field: "partner_id", allowNull: true, type: DataType.INTEGER })
    partnerId?: number;
}