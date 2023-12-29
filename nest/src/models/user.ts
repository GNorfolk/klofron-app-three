import {
  Model,
  Table,
  Column,
  DataType,
  Index,
  Sequelize,
  ForeignKey,
} from 'sequelize-typescript';

export interface userAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  family_id: number;
  created_at?: Date;
  deleted_at?: Date;
}

@Table({ tableName: 'user', timestamps: false })
export class user
  extends Model<userAttributes, userAttributes>
  implements userAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id?: number;

  @Column({ type: DataType.STRING(155) })
  @Index({ name: 'username', using: 'BTREE', order: 'ASC', unique: true })
  username!: string;

  @Column({ type: DataType.STRING(155) })
  @Index({ name: 'email', using: 'BTREE', order: 'ASC', unique: true })
  email!: string;

  @Column({ type: DataType.STRING(155) })
  password!: string;

  @Column({ type: DataType.INTEGER })
  @Index({ name: 'family_id', using: 'BTREE', order: 'ASC', unique: false })
  family_id!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  deleted_at?: Date;
}
