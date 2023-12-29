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

  @PrimaryGeneratedColumn({ type: "int" })
  id?: number;

  @Column({ type: "varchar", length: 155 })
  name!: string;

  @Column({ type: "int" })
  family_id!: number;

  @Column({ type: "int" })
  father_id!: number;

  @Column({ type: "int" })
  mother_id!: number;

  @Column({ type: "varchar", length: 155 })
  gender!: string;

  @Column({ nullable: true, type: "int" })
  house_id?: number;

  @AfterLoad()
  calculateAge(): void {
    this.age = Math.floor(((new Date()).valueOf() - (new Date(this.created_at)).valueOf()) / day_in_ms);
  }

  @CreateDateColumn()
  created_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column({ nullable: true, type: "int" })
  partner_id?: number;
}
