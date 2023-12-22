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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rooms: number;

  @Column()
  storage: number;

  @Column()
  family_id: number;

  // @OneToOne(() => Resource, (resource) => resource.house) // specify inverse side as a second parameter
  // @OneToOne('Resource', 'house') // specify inverse side as a second parameter
  // resource: Resource

  @Column()
  type_id: number;

  @Column()
  land: number;

  @CreateDateColumn()
  created_at: Date;
}
