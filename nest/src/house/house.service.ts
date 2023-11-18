import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './entities/house.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House) private houseRepository: Repository<House>,
  ) {}

  create(createHouseDto: CreateHouseDto) {
    return 'This action adds a new house';
  }

  async findAll(): Promise<House[]> {
    return await this.houseRepository.find();
  }

  async findOne(id: number): Promise<House> {
    return await this.houseRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }
}
