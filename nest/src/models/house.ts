import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface houseAttributes {
  id?: number;
  name: string;
  rooms: number;
  storage: number;
  food?: number;
  wood?: number;
  family_id: number;
  created_at?: Date;
  type_id: number;
  land: number;
}

@Table({ tableName: 'house', timestamps: false })
export class house
  extends Model<houseAttributes, houseAttributes>
  implements houseAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.STRING(155) })
  name!: string;

  @Column({ type: DataType.INTEGER })
  rooms!: number;

  @Column({ type: DataType.INTEGER })
  storage!: number;

  @Column({ type: DataType.INTEGER, defaultValue: '0' })
  food?: number;

  @Column({ type: DataType.INTEGER, defaultValue: '0' })
  wood?: number;

  @Column({ type: DataType.INTEGER })
  @Index({ name: 'family_id', using: 'BTREE', order: 'ASC', unique: false })
  family_id!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @Column({ type: DataType.INTEGER })
  type_id!: number;

  @Column({ type: DataType.INTEGER })
  land!: number;
}
