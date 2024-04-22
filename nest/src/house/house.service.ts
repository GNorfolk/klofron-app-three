import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { House } from './entities/House';
import { Resource } from '../resource/entities/Resource';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House) private houseRepository: Repository<House>,
    private dataSource: DataSource
  ) {}

  async create(house: CreateHouseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      result = await queryRunner.manager.save(House, house);
      const food = {
        resource_type_name: "food",
        resource_house_id: result.house_id
      }
      const wood = {
        resource_type_name: "wood",
        resource_house_id: result.house_id
      }
      await queryRunner.manager.save(Resource, food);
      await queryRunner.manager.save(Resource, wood);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return result;
  }

  async findAll(query): Promise<House[]> {
    let houses = this.houseRepository
      .createQueryBuilder("house")
      .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
      .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
      .innerJoinAndSelect("house.house_family", "family")
      .leftJoinAndSelect("house.house_people", "person")
      if (query?.family_id && query?.exclude_ids) {
        const exclude_ids = query?.exclude_ids.split(",")
        houses = houses
          .where("house.house_family_id = :id", { id: query.family_id })
          .andWhere("house.house_id NOT IN (:...ids)", { ids: exclude_ids })
      } else if (query?.family_id) {
        houses = houses.where("house.house_family_id = :id", { id: query.family_id })
      } else if (query?.exclude_ids) {
        const exclude_ids = query?.exclude_ids.split(",")
        houses = houses.where("house.house_id NOT IN (:...ids)", { ids: exclude_ids })
      }
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
      .leftJoin("house.house_people", "person").addSelect("COUNT(person.house_id)", "house_people")
      .leftJoin("house.house_family", "family").addSelect("family.user_id", "house_user_id")
      .leftJoin("house.house_resources", "food", "food.type_name = 'food'").addSelect("food.volume", "house_food")
      .leftJoin("house.house_resources", "wood", "wood.type_name = 'wood'").addSelect("wood.volume", "house_wood")
      .where("house.house_id = :id", { id: id })
      .groupBy("food.id").addGroupBy("wood.id");
    return await house.getRawOne();
  }

  // curl --request POST localhost:5000/v2/house/2 --header "Content-Type: application/json" --data '{"name":"SomeHouseName"}'
  update(id: number, body) {
    return this.houseRepository
      .createQueryBuilder()
      .update(House)
      .set({ house_name: body.name })
      .where("id = :id", { id: id })
      .execute();
  }
}
