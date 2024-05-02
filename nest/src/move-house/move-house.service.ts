import { Injectable } from '@nestjs/common';
import { CreateMoveHouseDto } from './dto/create-move-house.dto';
import { UpdateMoveHouseDto } from './dto/update-move-house.dto';
import { MoveHouse } from './entities/MoveHouse';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class MoveHouseService {
  constructor(
    @InjectRepository(MoveHouse) private moveHouseRepository: Repository<MoveHouse>,
  ) {}

  create(createMoveHouseDto: CreateMoveHouseDto) {
    return 'This action adds a new moveHouse';
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
