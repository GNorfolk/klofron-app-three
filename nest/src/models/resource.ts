import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface resourceAttributes {
  id?: number;
  type_name: string;
  volume: number;
  house_id?: number;
  person_id?: number;
  created_at?: Date;
  deleted_at?: Date;
}

@Table({ tableName: 'resource', timestamps: false })
export class resource
  extends Model<resourceAttributes, resourceAttributes>
  implements resourceAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.STRING(155) })
  type_name!: string;

  @Column({ type: DataType.INTEGER })
  volume!: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  @Index({ name: 'house_id', using: 'BTREE', order: 'ASC', unique: false })
  house_id?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  @Index({ name: 'person_id', using: 'BTREE', order: 'ASC', unique: false })
  person_id?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  deleted_at?: Date;
}
