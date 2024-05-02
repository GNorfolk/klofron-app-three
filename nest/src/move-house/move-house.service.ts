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

  findAll() {
    return `This action returns all moveHouse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moveHouse`;
  }

  update(id: number, updateMoveHouseDto: UpdateMoveHouseDto) {
    return `This action updates a #${id} moveHouse`;
  }

  remove(id: number) {
    return `This action removes a #${id} moveHouse`;
  }
}
