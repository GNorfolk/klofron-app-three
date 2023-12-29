import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface moveHouseAttributes {
    id?: number;
    personId: number;
    originHouseId: number;
    destinationHouseId: number;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
}

@Table({ tableName: "move_house", timestamps: false })
export class moveHouse extends Model<moveHouseAttributes, moveHouseAttributes> implements moveHouseAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ field: "person_id", type: DataType.INTEGER })
    personId!: number;
    @Column({ field: "origin_house_id", type: DataType.INTEGER })
    originHouseId!: number;
    @Column({ field: "destination_house_id", type: DataType.INTEGER })
    destinationHouseId!: number;
    @Column({ field: "started_at", type: DataType.DATE, defaultValue: DataType.NOW })
    startedAt?: Date;
    @Column({ field: "completed_at", allowNull: true, type: DataType.DATE })
    completedAt?: Date;
    @Column({ field: "cancelled_at", allowNull: true, type: DataType.DATE })
    cancelledAt?: Date;
}