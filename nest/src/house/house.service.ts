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
      .createQueryBuilder("house")
      .select([
        "house.id AS id",
        "house.name AS name",
        "house.rooms AS rooms",
        "house.storage AS storage",
        "house.family_id AS family_id"
      ])
      .innerJoin("house.people", "person").addSelect("COUNT(person.house_id)", "people")
      .innerJoin("house.resources", "food", "food.type_name = 'food'").addSelect("food.volume", "food")
      .innerJoin("house.resources", "wood", "wood.type_name = 'wood'").addSelect("wood.volume", "wood")
      .where("house.id = :id", { id: id })
      .groupBy("food.id").addGroupBy("wood.id")
      .getRawOne();
    return house;
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }
}
