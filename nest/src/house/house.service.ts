import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { House } from './entities/House';
import { Resource } from '../resource/entities/Resource';
import { HouseRoadName } from './entities/HouseRoadName';
import { HouseRoadType } from './entities/HouseRoadType';
import { HouseRoad } from './entities/HouseRoad';
import { HouseAddress } from './entities/HouseAddress';

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
      const houseRoad = await this.findRoad()
      const houseNumber = houseRoad?.house_road_addresses.length > 0 ? houseRoad.house_road_addresses.slice(-1)[0].house_address_number : 0
      const houseAddress = await queryRunner.manager.save(HouseAddress, {
        house_address_number: houseNumber + 1,
        house_address_road_id: houseRoad.house_road_id
      });
      house.house_address_id = houseAddress.house_address_id
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
      await queryRunner.release();
      return result
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
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
      .innerJoinAndSelect("house.house_food", "house_food", "house_food.type_name = 'food'")
      .innerJoinAndSelect("house.house_wood", "house_wood", "house_wood.type_name = 'wood'")
      .innerJoinAndSelect("house.house_family", "family")
      .leftJoinAndSelect("house.house_people", "person")
      .leftJoinAndSelect("person.person_food", "person_food", "person_food.type_name = 'food'")
      .leftJoinAndSelect("person.person_wood", "person_wood", "person_wood.type_name = 'wood'")
      .leftJoinAndSelect("house.house_trades", "trades")
      .where("house.house_id = :id", { id: id })
    return await house.getOne();
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

  async findRoad(): Promise<HouseRoad> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roads = await queryRunner.manager
        .createQueryBuilder(HouseRoad, "road")
        .leftJoinAndSelect("road.house_road_addresses", "address")
        .orderBy("address.house_address_number", "ASC")
        .getMany();
      const filteredRoads = roads.filter(road =>
        road.house_road_addresses.length < road.house_road_capacity &&
        road.house_road_addresses.slice(-1)[0].house_address_number < road.house_road_capacity
      )
      const selectedId = Math.floor(Math.random() * filteredRoads.length)
      // ToDo: create new road if none have capacity 
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return filteredRoads[selectedId]
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async createRoad() {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const house_road_name = await queryRunner.manager
        .createQueryBuilder(HouseRoadName, "name")
        .where("name.house_road_name_theme = :str", { str: "animal" })
        .orderBy("RAND()")
        .limit(1)
        .getOne();
      const house_road_type = await queryRunner.manager
        .createQueryBuilder(HouseRoadType, "type")
        .orderBy("RAND()")
        .limit(1)
        .getOne();
      throw house_road_name.house_road_name_name + " " + house_road_type.house_road_type_name
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }
}
