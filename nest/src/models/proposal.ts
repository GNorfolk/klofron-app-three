import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface proposalAttributes {
  id?: number;
  proposer_person_id: number;
  accepter_person_id?: number;
  created_at?: Date;
  accepted_at?: Date;
  cancelled_at?: Date;
}

@Table({ tableName: 'proposal', timestamps: false })
export class proposal
  extends Model<proposalAttributes, proposalAttributes>
  implements proposalAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.INTEGER })
  proposer_person_id!: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  accepter_person_id?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  accepted_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  cancelled_at?: Date;
}
