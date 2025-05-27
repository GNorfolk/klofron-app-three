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
      try {
        inc = await queryRunner.manager.increment(Resource, {
          resource_type_name: body.resource_type,
          resource_person_id: body.person_id
        }, "resource_volume", body.resource_volume)
        dec = await queryRunner.manager.decrement(Resource, {
          resource_type_name: body.resource_type,
          resource_house_id: body.house_id
        }, "resource_volume", body.resource_volume)
      } catch {
        throw "Cannot reduce resource below zero!"
      }
      if (inc.affected != 1 || dec.affected != 1) throw "Cannot update Person and House resources!"
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .leftJoinAndSelect("person.person_resources", "person_resources")
        .innerJoinAndSelect("person.person_action_queue", "queue")
        .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
        .where("person.person_id = :id", { id: body.person_id })
        .getOne()
      if (person.person_action_queue.action_queue_action_cooldown) throw "Person cannot move resources while in action cooldown!"
      if (person.person_resources.find(r => r.resource_type_name === 'berry')?.resource_volume + person.person_resources.find(r => r.resource_type_name === 'birch')?.resource_volume > 3) throw "Person has too many resources!"
      const house = await queryRunner.manager
        .createQueryBuilder(House, "house")
        .innerJoinAndSelect("house.house_resources", "resources")
        .where("house.house_id = :id", { id: body.house_id })
        .getOne()
      if (person.person_resources.find(r => r.resource_type_name === 'berry')?.resource_volume + person.person_resources.find(r => r.resource_type_name === 'birch')?.resource_volume > house.house_storage) throw "House has too many resources!"
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [inc, dec];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async updateDecrementResource(house_id, resource_type) {
    const queryRunner = this.dataSource.createQueryRunner();
    let dec
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const house = await queryRunner.manager
        .createQueryBuilder(House, "house")
        .innerJoinAndSelect("house.house_resources", "resources")
        .where("house.house_id = :id", { id: house_id })
        .getOne()
      if (resource_type == "berry" && house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume < 1) throw "House cannot decrement berry below zero!"
      if (resource_type == 'birch' && house.house_resources.find(r => r.resource_type_name === 'birch')?.resource_volume < 1) throw "House cannot decrement birch below zero!"
      dec = await queryRunner.manager.decrement(Resource, {
        resource_type_name: resource_type,
        resource_house_id: house_id
      }, "resource_volume", 1)
      if (dec.affected != 1) throw "Cannot update House resource!"
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [dec];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }
}
