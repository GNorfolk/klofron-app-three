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
      house.house_rooms = 2;
      await this.createHouse(result, queryRunner, house)
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

  async createHouse(result, queryRunner, house) {
    const houseRoad = await this.findRoad()
    const houseNumber = houseRoad?.house_road_addresses.length > 0 ? houseRoad.house_road_addresses.slice(-1)[0].house_address_number : 0
    const houseAddress = await queryRunner.manager.save(HouseAddress, {
      house_address_number: houseNumber + 1,
      house_address_road_id: houseRoad.house_road_id
    });
    house.house_address_id = houseAddress.house_address_id
    result = await queryRunner.manager.save(House, house);
    const berry = {
      resource_type_name: "berry",
      resource_house_id: result.house_id
    }
    const bamboo = {
      resource_type_name: "bamboo",
      resource_house_id: result.house_id
    }
    await queryRunner.manager.save(Resource, berry);
    await queryRunner.manager.save(Resource, bamboo);
    return result;
  }

  async findAll(query): Promise<House[]> {
    let houses = this.houseRepository
      .createQueryBuilder("house")
      .innerJoinAndSelect("house.house_address", "address")
      .innerJoinAndSelect("address.house_address_road", "road")
      .innerJoinAndSelect("house.house_resources", "resources")
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
      houses = houses.andWhere("house.house_deleted_at IS NULL")
    return await houses.getMany();
  }

  async findOne(id: number): Promise<House> {
    const house = this.houseRepository
      .createQueryBuilder("house")
      .innerJoinAndSelect("house.house_address", "address")
      .innerJoinAndSelect("address.house_address_road", "road")
      .innerJoinAndSelect("house.house_resources", "house_resources")
      .innerJoinAndSelect("house.house_family", "house_family")
      .leftJoinAndSelect("house.house_people", "person")
      .leftJoinAndSelect("house.house_trades", "trade")
      .leftJoinAndSelect("person.person_family", "person_family")
      .leftJoinAndSelect("person.person_resources", "person_resources")
      .leftJoinAndSelect("person.person_action_queue", "queue")
      .leftJoinAndSelect("queue.action_queue_next_actions", "next_actions", "next_actions.started_at IS NULL AND next_actions.cancelled_at IS NULL AND next_actions.completed_at IS NULL")
      .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
      .leftJoinAndSelect("cooldown.action_cooldown_diceroll", "diceroll")
      .leftJoinAndSelect("person.person_skills", "person_skills")
      .orderBy('person.id', 'ASC')
      .where("house.house_id = :id", { id: id })
    return await house.getOne();
  }

  async findRoad(): Promise<HouseRoad> {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
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
      if (filteredRoads.length > 0) {
        const selectedId = Math.floor(Math.random() * filteredRoads.length)
        result = filteredRoads[selectedId]
      } else {
        const road = await this.createRoad();
        result = await queryRunner.manager
          .createQueryBuilder(HouseRoad, "road")
          .leftJoinAndSelect("road.house_road_addresses", "address")
          .where("road.house_road_id = :id", { id: road.house_road_id })
          .getOne();
      }
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

  async createRoad(): Promise<HouseRoad> {
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
      result = await queryRunner.manager.save(HouseRoad, {
        house_road_name: house_road_name.house_road_name_name + " " + house_road_type.house_road_type_name,
        house_road_capacity: house_road_type.house_road_type_capacity
      });
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
