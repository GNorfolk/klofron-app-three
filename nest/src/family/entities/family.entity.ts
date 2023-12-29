import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Family {
  @PrimaryGeneratedColumn({ type: "int" })
  id?: number;

  @Column({ type: "varchar", length: 155 })
  name!: string;

  @CreateDateColumn()
  created_at?: Date;
}
