import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/Resource';
import { Repository, DataSource } from 'typeorm';
import { Person } from '../person/entities/Person';
import { House } from '../house/entities/House';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource) private resourceRepository: Repository<Resource>,
    private dataSource: DataSource
  ) {}

  async findAll(): Promise<Resource[]> {
    return await this.resourceRepository.find();
  }

  async findByHouseId(house_id: number) {
    return await this.resourceRepository.find({
      where: {
        resource_house_id: house_id,
      },
    });
  }

  async updateMoveResource(body) {
    const queryRunner = this.dataSource.createQueryRunner();
    let inc, dec
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      inc = await queryRunner.manager.increment(Resource, {
        resource_type_name: body.resource_type,
        resource_person_id: body.person_id
      }, "resource_volume", body.resource_volume)
      dec = await queryRunner.manager.decrement(Resource, {
        resource_type_name: body.resource_type,
        resource_house_id: body.house_id
      }, "resource_volume", body.resource_volume)
      if (inc.affected != 1 || dec.affected != 1) throw [inc, dec]
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .leftJoinAndSelect("person.person_food", "person_food", "person_food.type_name = 'food'")
        .leftJoinAndSelect("person.person_wood", "person_wood", "person_wood.type_name = 'wood'")
        .where("person.person_id = :id", { id: body.person_id })
        .getOne()
      if (person.person_food.resource_volume + person.person_wood.resource_volume > 3) throw person
      const house = await queryRunner.manager
        .createQueryBuilder(House, "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("house.house_id = :id", { id: body.house_id })
        .getOne()
      if (house.house_food.resource_volume + house.house_wood.resource_volume > house.house_storage) throw house
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [inc, dec];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException();
    }
  }

}
