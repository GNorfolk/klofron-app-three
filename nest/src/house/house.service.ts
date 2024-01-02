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
    const houses = this.houseRepository
      .createQueryBuilder();
    return await houses.getMany();
  }

  async findOne(id: number): Promise<House> {
    const house = this.houseRepository
      .createQueryBuilder("house")
      .select([
        "house.house_id",
        "house.house_name",
        "house.house_rooms",
        "house.house_storage",
        "house.house_family_id",
        "0 AS house_food_in_trade",
        "0 AS house_wood_in_trade"
      ])
      .innerJoin("house.house_people", "person").addSelect("COUNT(person.house_id)", "house_people")
      .leftJoin("house.house_resources", "food", "food.type_name = 'food'").addSelect("food.volume", "house_food")
      .leftJoin("house.house_resources", "wood", "wood.type_name = 'wood'").addSelect("wood.volume", "house_wood")
      .where("house.house_id = :id", { id: id })
      .groupBy("food.id").addGroupBy("wood.id");
    return await house.getRawOne();
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }
}
