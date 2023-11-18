import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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

  @Column()
  type_id: number;

  @Column()
  land: number;

  @CreateDateColumn()
  created_at: Date;
}
