import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface move_houseAttributes {
  id?: number;
  person_id: number;
  origin_house_id: number;
  destination_house_id: number;
  started_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
}

@Table({ tableName: 'move_house', timestamps: false })
export class move_house
  extends Model<move_houseAttributes, move_houseAttributes>
  implements move_houseAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.INTEGER })
  person_id!: number;

  @Column({ type: DataType.INTEGER })
  origin_house_id!: number;

  @Column({ type: DataType.INTEGER })
  destination_house_id!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  started_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  completed_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  cancelled_at?: Date;
}
