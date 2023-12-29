import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { House } from '../../house/entities/house.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn({ type: "int" })
  id?: number;

  @Column({ type: "varchar", length: 155 })
  type_name!: string;

  @Column({ type: "int" })
  volume!: number;
  
  // @OneToOne(() => House, (house) => house.resource) // specify inverse side as a second parameter
  // @OneToOne('House', 'resource') // specify inverse side as a second parameter
  // @JoinColumn()
  // house: House

  @Column({ nullable: true, type: "int" })
  house_id?: number;

  @Column({ nullable: true, type: "int" })
  person_id?: number;

  @CreateDateColumn({ type: "datetime" })
  created_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
