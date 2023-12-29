import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Resource } from '../../resource/entities/resource.entity';


@Entity()
export class House {
  // { type: "varchar", length: 200, unique: true, nullable: true, default: false }

  @PrimaryGeneratedColumn({ type: "int" })
  id?: number;

  @Column({ type: "varchar", length: 155 })
  name!: string;

  @Column({ type: "int" })
  rooms!: number;

  @Column({ type: "int" })
  storage!: number;

  // @OneToOne(() => Resource, (resource) => resource.house) // specify inverse side as a second parameter
  // @OneToOne('Resource', 'house') // specify inverse side as a second parameter
  // resource: Resource

  @Column({ type: "int", default: 0 })
  food?: number;

  @Column({ type: "int", default: 0 })
  wood?: number;

  @Column({ type: "int" })
  family_id!: number;

  @CreateDateColumn({ type: "datetime" })
  created_at?: Date;

  @Column({ type: "int" })
  type_id!: number;

  @Column({ type: "int" })
  land!: number;
}
