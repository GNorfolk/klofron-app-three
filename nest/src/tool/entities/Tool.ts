import { House } from 'src/house/entities/House';
import { Person } from 'src/person/entities/Person';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

export enum ToolType {
  AXE = 'axe',
  PICKAXE = 'pickaxe'
}

export enum ToolMaterial {
  BASALT = 'basalt',
  FLINT = 'flint',
  SANDSTONE = 'sandstone'
}

export enum ToolHandle {
  BIRCH = 'birch',
  OAK = 'oak',
  SPRUCE = 'spruce'
}

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ToolType })
  type: ToolType;

  @Column()
  durability: number;

  @Column({ type: 'enum', enum: ToolMaterial })
  material: ToolMaterial;

  @Column({ type: 'enum', enum: ToolHandle, nullable: true })
  handle?: ToolHandle;

  @ManyToOne(() => House, { nullable: true })
  @JoinColumn({ name: 'house_id' })
  house?: House;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'person_id' })
  person?: Person;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
