import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface actionAttributes {
  id?: number;
  person_id: number;
  type_id: number;
  started_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  infinite?: number;
}

@Table({ tableName: 'action', timestamps: false })
export class action
  extends Model<actionAttributes, actionAttributes>
  implements actionAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.INTEGER })
  person_id!: number;

  @Column({ type: DataType.INTEGER })
  type_id!: number;

  @Column({ allowNull: true, type: DataType.DATE })
  started_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  completed_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  cancelled_at?: Date;

  @Column({ type: DataType.TINYINT, defaultValue: '0' })
  infinite?: number;
}
