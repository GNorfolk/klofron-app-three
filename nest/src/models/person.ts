import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface personAttributes {
  id?: number;
  name: string;
  family_id: number;
  father_id: number;
  mother_id: number;
  gender: string;
  house_id?: number;
  created_at?: Date;
  deleted_at?: Date;
  partner_id?: number;
}

@Table({ tableName: 'person', timestamps: false })
export class person
  extends Model<personAttributes, personAttributes>
  implements personAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.STRING(155) })
  name!: string;

  @Column({ type: DataType.INTEGER })
  @Index({ name: 'family_id', using: 'BTREE', order: 'ASC', unique: false })
  family_id!: number;

  @Column({ type: DataType.INTEGER })
  father_id!: number;

  @Column({ type: DataType.INTEGER })
  mother_id!: number;

  @Column({ type: DataType.STRING(155) })
  gender!: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  @Index({ name: 'house_id', using: 'BTREE', order: 'ASC', unique: false })
  house_id?: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  deleted_at?: Date;

  @Column({ allowNull: true, type: DataType.INTEGER })
  partner_id?: number;
}
