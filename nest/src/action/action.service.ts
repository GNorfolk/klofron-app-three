import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Action } from './entities/Action';
import { Person } from '../person/entities/Person';
import { Resource } from '../resource/entities/Resource';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private actionRepository: Repository<Action>,
    private dataSource: DataSource
  ) {}

  async create(action: CreateActionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
        .leftJoinAndSelect("person.person_house", "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("person.person_id = :id", { id: action.action_person_id })
        .getOne();
      if (person.person_actions.length > 0) throw "Action already in progress!";
      if (action.action_type_id == 2) {
        if (person.person_house.house_food.resource_volume < 1) throw "Not enough food, 1 required!"
        const food = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "food",
          resource_house_id: person.person_house_id
        }, "resource_volume", 1);
        if (food.affected != 1) throw "Cannot decrement house resources!"
      } else if (action.action_type_id == 3) {
        const storageWood = ( person.person_house.house_storage / 3 ) + 1;
        if (person.person_house.house_food.resource_volume < 1) throw "Not enough food, 1 required!"
        if (person.person_house.house_wood.resource_volume < storageWood) throw "Not enough wood, " + storageWood + " required!"
        const food = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "food",
          resource_house_id: person.person_house_id
        }, "resource_volume", 1);
        const wood = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "wood",
          resource_house_id: person.person_house_id
        }, "resource_volume", storageWood);
        if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
      } else if (action.action_type_id == 4) {
        const roomsWood = 2 * ( person.person_house.house_rooms + 1 );
        if (person.person_house.house_food.resource_volume < 1) throw "Not enough food, 1 required!"
        if (person.person_house.house_wood.resource_volume < roomsWood) throw "Not enough wood, " + roomsWood + " required!"
        const food = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "food",
          resource_house_id: person.person_house_id
        }, "resource_volume", 1);
        const wood = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "wood",
          resource_house_id: person.person_house_id
        }, "resource_volume", roomsWood);
        if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
      } else if (action.action_type_id == 5) {
        if (person.person_house.house_food.resource_volume < 3) throw "Not enough food, 3 required!"
        if (person.person_house.house_wood.resource_volume < 12) throw "Not enough wood, 12 required!"
        const food = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "food",
          resource_house_id: person.person_house_id
        }, "resource_volume", 3);
        const wood = await queryRunner.manager.decrement(Resource, {
          resource_type_name: "wood",
          resource_house_id: person.person_house_id
        }, "resource_volume", 12);
        if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
      }
      result = await queryRunner.manager.save(Action, action);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [result];
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async findAll(query): Promise<Action[]> {
    let actions =  this.actionRepository
      .createQueryBuilder("action")
      .orderBy("action.started_at", "DESC")
    if (query?.limit) {
      actions = actions.limit(query.limit)
    }
    if (query?.person_id) {
      actions = actions.where("action.person_id = :id", { id: query.person_id })
      if (query?.current && query.current == "true") {
        actions = actions.andWhere("action.completed_at IS NULL AND action.cancelled_at IS NULL");
      } else if (query?.current && query.current == "false") {
        actions = actions.andWhere("(action.completed_at IS NOT NULL OR action.cancelled_at IS NOT NULL)");
      }
    }
    return await actions.getMany();
  }

  async findOne(id: number): Promise<Action> {
    return await this.actionRepository.findOne({
      where: {
        action_id: id,
      },
    });
  }

  async updateCancelPersonAction(person_id) {
    const queryRunner = this.dataSource.createQueryRunner();
    let cancel;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
        .where("person.person_id = :id", { id: person_id })
        .getOne();
      if (person.person_actions.length == 0) throw "No actions cancellable!";
      if (person.person_actions.length > 1) throw "Too many current actions returned!";
      cancel = await queryRunner.manager.update(Action, person.person_actions[0].action_id, { action_cancelled_at: new Date() });
      if (cancel.affected != 1) throw "Unable to cancel action!";
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [cancel];
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async updateCancelAction(action_id) {
    const queryRunner = this.dataSource.createQueryRunner();
    let cancel;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      cancel = await queryRunner.manager.update(Action, action_id, { action_cancelled_at: new Date() });
      if (cancel.affected != 1) throw "Unable to cancel action!";
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [cancel];
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }
}
