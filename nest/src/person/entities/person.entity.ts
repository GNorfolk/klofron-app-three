import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  family_id: number;

  @Column()
  father_id: number;

  @Column()
  mother_id: number;

  @Column()
  gender: string;

  @Column()
  house_id: number;

  @Column()
  partner_id: number;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
