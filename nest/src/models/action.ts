import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface actionAttributes {
    id?: number;
    personId: number;
    typeId: number;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    infinite?: number;
}

@Table({ tableName: "action", timestamps: false })
export class action extends Model<actionAttributes, actionAttributes> implements actionAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ field: "person_id", type: DataType.INTEGER })
    personId!: number;
    @Column({ field: "type_id", type: DataType.INTEGER })
    typeId!: number;
    @Column({ field: "started_at", allowNull: true, type: DataType.DATE })
    startedAt?: Date;
    @Column({ field: "completed_at", allowNull: true, type: DataType.DATE })
    completedAt?: Date;
    @Column({ field: "cancelled_at", allowNull: true, type: DataType.DATE })
    cancelledAt?: Date;
    @Column({ type: DataType.TINYINT, defaultValue: "0" })
    infinite?: number;
}