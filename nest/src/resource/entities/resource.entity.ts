import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { House } from '../../house/entities/house.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type_name: string;

  @Column()
  volume: number;

  @OneToOne(() => House, {eager: true})
  @JoinColumn({name: 'house_id'})
  house_id: House;

  @CreateDateColumn()
  created_at: Date;
}
