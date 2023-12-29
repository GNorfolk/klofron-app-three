import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface tradeAttributes {
    id?: number;
    houseId: number;
    offeredTypeId: number;
    offeredVolume: number;
    requestedTypeId: number;
    requestedVolume: number;
    createdAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
}

@Table({ tableName: "trade", timestamps: false })
export class trade extends Model<tradeAttributes, tradeAttributes> implements tradeAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ field: "house_id", type: DataType.INTEGER })
    @Index({ name: "house_id", using: "BTREE", order: "ASC", unique: false })
    houseId!: number;
    @Column({ field: "offered_type_id", type: DataType.INTEGER })
    offeredTypeId!: number;
    @Column({ field: "offered_volume", type: DataType.INTEGER })
    offeredVolume!: number;
    @Column({ field: "requested_type_id", type: DataType.INTEGER })
    requestedTypeId!: number;
    @Column({ field: "requested_volume", type: DataType.INTEGER })
    requestedVolume!: number;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
    @Column({ field: "completed_at", allowNull: true, type: DataType.DATE })
    completedAt?: Date;
    @Column({ field: "cancelled_at", allowNull: true, type: DataType.DATE })
    cancelledAt?: Date;
}