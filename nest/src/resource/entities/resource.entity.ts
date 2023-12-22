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

  // @OneToOne(() => House, (house) => house.resource) // specify inverse side as a second parameter
  // @OneToOne('House', 'resource') // specify inverse side as a second parameter
  // @JoinColumn()
  // house: House

  @CreateDateColumn()
  created_at: Date;
}
