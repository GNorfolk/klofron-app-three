import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from "sequelize-typescript";

export interface proposalAttributes {
    id?: number;
    proposerPersonId: number;
    accepterPersonId?: number;
    createdAt?: Date;
    acceptedAt?: Date;
    cancelledAt?: Date;
}

@Table({ tableName: "proposal", timestamps: false })
export class proposal extends Model<proposalAttributes, proposalAttributes> implements proposalAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: "PRIMARY", using: "BTREE", order: "ASC", unique: true })
    id?: number;
    @Column({ field: "proposer_person_id", type: DataType.INTEGER })
    proposerPersonId!: number;
    @Column({ field: "accepter_person_id", allowNull: true, type: DataType.INTEGER })
    accepterPersonId?: number;
    @Column({ field: "created_at", type: DataType.DATE, defaultValue: DataType.NOW })
    createdAt?: Date;
    @Column({ field: "accepted_at", allowNull: true, type: DataType.DATE })
    acceptedAt?: Date;
    @Column({ field: "cancelled_at", allowNull: true, type: DataType.DATE })
    cancelledAt?: Date;
}