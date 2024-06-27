import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Action } from './entities/Action';
import { Person } from '../person/entities/Person';
import { PersonSkills } from '../person/entities/PersonSkills';
import { Resource } from '../resource/entities/Resource';
import { House } from '../house/entities/House';
import { HouseService } from '../house/house.service';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private actionRepository: Repository<Action>,
    private houseService: HouseService,
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
        .leftJoinAndSelect("person.person_students", "student")
        .leftJoinAndSelect("student.person_actions", "student_action", "student_action.cancelled_at IS NULL AND student_action.completed_at IS NULL")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("person.person_id = :id", { id: action.action_person_id })
        .getOne();
      if (person.person_students.length > 0) {
        result = await this.utilityCreateActionStudents(queryRunner, action, person)
      } else {
        result = await this.utilityCreateActionSingle(queryRunner, action, person)
      }
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

  async utilityCreateActionStudents(queryRunner, action, person) {
    const aliveStudents = person.person_students.filter(student => student.person_deleted_at == null)
    if (person.person_students.length != aliveStudents.length) throw "One or more students are deceased!"
    const availableStudents = person.person_students.filter(student => student.person_actions.length == 0)
    if (person.person_students.length != availableStudents.length) throw "One or more students have running actions!"
    const colocatedStudents = person.person_students.filter(student => student.person_house_id == person.person_house_id)
    if (person.person_students.length != colocatedStudents.length) throw "One or more students are not colocated with their teacher!"
    for (const student of person.person_students) {
      if (action.action_type_id == 2) {
        await this.utilityCreateGetFoodAction(queryRunner, student)
      } else if (action.action_type_id == 3) {
        await this.utilityCreateGetWoodAction(queryRunner, student)
      } else if (action.action_type_id == 4) {
        await this.utilityCreateIncreaseStorageAction(queryRunner, student)
      } else if (action.action_type_id == 5) {
        await this.utilityCreateIncreaseRoomsAction(queryRunner, student)
      }
    }
    action.action_type_id = 7;
    return await queryRunner.manager.save(Action, action);
  }

  async utilityCreateActionSingle(queryRunner, action, person) {
    if (person.person_deleted_at) throw "Person is deceased!";
    if (person.person_actions.length > 0) throw "Action already in progress!";
    if (action.action_type_id == 2) {
      await this.utilityCreateGetFoodAction(queryRunner, person)
    } else if (action.action_type_id == 3) {
      await this.utilityCreateGetWoodAction(queryRunner, person)
    } else if (action.action_type_id == 4) {
      await this.utilityCreateIncreaseStorageAction(queryRunner, person)
    } else if (action.action_type_id == 5) {
      await this.utilityCreateIncreaseRoomsAction(queryRunner, person)
    }
    return await queryRunner.manager.save(Action, action);
  }

  async utilityCreateGetFoodAction(queryRunner, person) {
    if (person.person_house.house_food.resource_volume < 1) throw "Not enough food, 1 required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", 1);
    if (food.affected != 1) throw "Cannot decrement house resources!"
  }

  async utilityCreateGetWoodAction(queryRunner, person) {
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
  }

  async utilityCreateIncreaseStorageAction(queryRunner, person) {
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
  }

  async utilityCreateIncreaseRoomsAction(queryRunner, person) {
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

  // curl --request PATCH localhost:5000/v2/action
  async updateProcessActions() {
    const actions = await this.actionRepository
      .createQueryBuilder("action")
      .innerJoinAndSelect("action.action_person", "person")
      .leftJoinAndSelect("person.person_house", "house")
      .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
      .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
      .where("action.cancelled_at IS NULL AND action.completed_at IS NULL AND action.started_at + INTERVAL 8 HOUR < now()")
      .getMany();
    console.log("There are " + actions.length + " actions!")
    for (const action of actions) {
      try {
        if (action.action_person.person_deleted_at) {
          await this.actionRepository.update(action.action_id, { action_cancelled_at: new Date() });
          throw "Person is deceased!"
        }
        if (action.action_type_id == 1) {
          await this.updateProcessGetFood(action.action_id)
        } else if (action.action_type_id == 2) {
          await this.updateProcessGetWood(action.action_id)
        } else if (action.action_type_id == 3) {
          await this.updateProcessIncreaseStorage(action.action_id)
        } else if (action.action_type_id == 4) {
          await this.updateProcessIncreaseRooms(action.action_id)
        } else if (action.action_type_id == 5) {
          await this.updateProcessCreateHouse(action.action_id)
        } else if (action.action_type_id == 6) {
          await this.updateProcessBirthRecovery(action.action_id)
        } else if (action.action_type_id == 7) {
          await this.updateProcessTeachStudents(action.action_id)
        } else {
          console.log("pass")
        }
      }
      catch (err) {
        console.log("Something went wrong: " + err)
      }
    }
  }

  async updateProcessGetFood(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const action = await this.actionRepository
        .createQueryBuilder("action")
        .innerJoinAndSelect("action.action_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("person.person_house", "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_person.person_skills.person_skills_gatherer_level)
      const house = action.action_person.person_house
      if (diceRoll && house.house_storage >= house.house_food.resource_volume + house.house_wood.resource_volume + 2) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(Resource, {
          resource_type_name: "food",
          resource_house_id: action.action_person.person_house_id
        }, "resource_volume", 2);
        await queryRunner.manager.increment(PersonSkills, {
          person_skills_id: action.action_person.person_skills_id
        }, "person_skills_gatherer_experience", 1);
        console.log("GetFoodDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("GetFoodNotDone")
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessGetWood(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const action = await this.actionRepository
        .createQueryBuilder("action")
        .innerJoinAndSelect("action.action_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("person.person_house", "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_person.person_skills.person_skills_lumberjack_level)
      const house = action.action_person.person_house
      if (diceRoll && house.house_storage >= house.house_food.resource_volume + house.house_wood.resource_volume + 1) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(Resource, {
          resource_type_name: "wood",
          resource_house_id: action.action_person.person_house_id
        }, "resource_volume", 1);
        await queryRunner.manager.increment(PersonSkills, {
          person_skills_id: action.action_person.person_skills_id
        }, "person_skills_lumberjack_experience", 1);
        console.log("GetWoodDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("GetWoodNotDone")
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessIncreaseStorage(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const action = await this.actionRepository
        .createQueryBuilder("action")
        .innerJoinAndSelect("action.action_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(House, {
          house_id: action.action_person.person_house_id
        }, "house_storage", 3);
        await queryRunner.manager.increment(PersonSkills, {
          person_skills_id: action.action_person.person_skills_id
        }, "person_skills_builder_experience", 1);
        console.log("IncreaseStorageDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("IncreaseStorageNotDone")
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessIncreaseRooms(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const action = await this.actionRepository
        .createQueryBuilder("action")
        .innerJoinAndSelect("action.action_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(House, {
          house_id: action.action_person.person_house_id
        }, "house_rooms", 1);
        await queryRunner.manager.increment(PersonSkills, {
          person_skills_id: action.action_person.person_skills_id
        }, "person_skills_builder_experience", 1);
        console.log("IncreaseRoomsDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("IncreaseRoomsNotDone")
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessCreateHouse(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const action = await this.actionRepository
        .createQueryBuilder("action")
        .innerJoinAndSelect("action.action_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        result = await this.houseService.createHouse(result, queryRunner, {
            house_family_id: action.action_person.person_family_id,
            house_rooms: 2
          }
        )
        await queryRunner.manager.increment(PersonSkills, {
          person_skills_id: action.action_person.person_skills_id
        }, "person_skills_builder_experience", 1);
        console.log("CreateHouseDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("CreateHouseNotDone")
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessBirthRecovery(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
      console.log("BirthRecoveryDone")
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async updateProcessTeachStudents(actionId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
      console.log("TeachStudentsDone")
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err
    }
  }

  async utilityGetDiceRoll(skillLevel: number) {
    const blackRoll = Math.floor(12 * Math.random() + 1);
    const redRoll = Math.floor(12 * Math.random() + 1);
    return blackRoll + skillLevel > redRoll;
  }
}
