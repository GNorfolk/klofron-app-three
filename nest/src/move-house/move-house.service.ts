import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMoveHouseDto } from './dto/create-move-house.dto';
import { UpdateMoveHouseDto } from './dto/update-move-house.dto';
import { MoveHouse } from './entities/MoveHouse';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from '../person/entities/Person';

@Injectable()
export class MoveHouseService {
  constructor(
    @InjectRepository(MoveHouse) private moveHouseRepository: Repository<MoveHouse>,
    private dataSource: DataSource
  ) {}

  async create(moveHouse: CreateMoveHouseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let move, person
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      move = await queryRunner.manager.save(MoveHouse, moveHouse);
      person = await queryRunner.manager.update(Person, moveHouse.move_house_person_id, { person_house_id: null });
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [move, person];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<MoveHouse[]> {
    let moveHouse = this.moveHouseRepository
      .createQueryBuilder("move_house")
    return await moveHouse.getMany();
  }

  async findOne(id: number): Promise<MoveHouse> {
    const person = this.moveHouseRepository
      .createQueryBuilder("move_house")
      .where("move_house.id = :id", { id: id })
    return await person.getOne();
  }

  update(id: number, updateMoveHouseDto: UpdateMoveHouseDto) {
    return `This action updates a #${id} moveHouse`;
  }

  remove(id: number) {
    return `This action removes a #${id} moveHouse`;
  }
}
