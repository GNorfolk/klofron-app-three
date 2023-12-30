import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './entities/House';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House) private houseRepository: Repository<House>,
  ) {}

  create(createHouseDto: CreateHouseDto) {
    return 'This action adds a new house';
  }

  async findAll(): Promise<House[]> {
    const houses = await this.houseRepository
      .createQueryBuilder()
      .getMany();
    return houses;
  }

  async findOne(id: number): Promise<House> {
    const house = await this.houseRepository
      .createQueryBuilder()
      .where("house.id = :id", { id: id })
      .getOne();
    return house;
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }
}
