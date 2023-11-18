import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  AfterLoad,
} from 'typeorm';

const day_in_ms = 24 * 3600 * 1000

@Entity()
export class Person {
  protected age: number;

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

  @AfterLoad()
  calculateAge(): void {
    this.age = Math.floor(((new Date()).valueOf() - (new Date(this.created_at)).valueOf()) / day_in_ms);
  }

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
