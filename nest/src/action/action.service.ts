import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Action } from './entities/Action';
import { Person } from '../person/entities/Person';
import { PersonSkills } from '../person/entities/PersonSkills';
import { Resource } from '../resource/entities/Resource';
import { House } from '../house/entities/House';
import { HouseService } from '../house/house.service';
import { ActionCooldown } from './entities/ActionCooldown';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private actionRepository: Repository<Action>,
    private houseService: HouseService,
    private dataSource: DataSource
  ) {}

  async create(action: CreateActionDto, doTheThing: boolean = false) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_action_queue", "queue")
        .leftJoinAndSelect("queue.action_queue_current_action", "current_action", "current_action.started_at IS NOT NULL AND current_action.cancelled_at IS NULL AND current_action.completed_at IS NULL")
        .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
        .leftJoinAndSelect("person.person_house", "house")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("person.person_students", "student")
        .leftJoinAndSelect("student.person_action_queue", "student_queue")
        .leftJoinAndSelect("student_queue.action_queue_current_action", "student_current_action", "student_current_action.started_at IS NOT NULL AND student_current_action.cancelled_at IS NULL AND student_current_action.completed_at IS NULL")
        .leftJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .leftJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("person.person_action_queue_id = :id", { id: action.action_queue_id })
        .getOne();
      if (!person) throw "Action person cannot be found on the backend!"
      if (action.action_add_to_queue) {
        if (person.person_teacher_id) {
          throw "Cannot queue action when teacher is set!"
        } else if (person.person_action_queue.action_queue_action_cooldown) {
          result = await queryRunner.manager.save(Action, action);
        } else {
          throw "Cannot add action to queue when person is not in cooldown already!"
        }
      } else if (person.person_students.length > 0) {
        result = await this.utilityCreateActionStudents(queryRunner, action, person)
      } else {
        result = await this.utilityDoTheThing(queryRunner, action, person)
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

  async utilityCreateActionStudents(queryRunner, action: CreateActionDto, person: Person) {
    const aliveStudents = person.person_students.filter(student => student.person_deleted_at == null)
    if (person.person_students.length != aliveStudents.length) throw "One or more students are deceased!"
    const availableStudents = person.person_students.filter(student => !student.person_action_queue.action_queue_current_action)
    if (person.person_students.length != availableStudents.length) throw "One or more students have running actions!"
    const colocatedStudents = person.person_students.filter(student => student.person_house_id == person.person_house_id)
    if (person.person_students.length != colocatedStudents.length) throw "One or more students are not colocated with their teacher!"
    if (action.action_type_id == -1) {
      throw "Cannot perform action when teacher is set!"
    } else if (action.action_type_id == 1) {
      // Do nothing
    } else if (action.action_type_id == 2) {
      await this.utilityPrepareGetWoodAction(queryRunner, person, person.person_students.length);
    } else if (action.action_type_id == 3) {
      await this.utilityPrepareIncreaseStorageAction(queryRunner, person, person.person_students.length);
    } else if (action.action_type_id == 4) {
      await this.utilityPrepareIncreaseRoomsAction(queryRunner, person, person.person_students.length);
    } else if (action.action_type_id == 5) {
      await this.utilityPrepareCreateHouseAction(queryRunner, person, person.person_students.length);
    } else if (action.action_type_id == 6) {
      // Do nothing
    } else {
      throw "Invalid action_type_id, got: " + action.action_type_id;
    }
    for (const student of person.person_students) {
      let student_action = structuredClone(action);
      student_action.action_id = null;
      student_action.action_queue_id = student.person_action_queue_id;
      student_action.action_started_at = new Date();
      if (student_action.action_type_id == 1) {
        student_action.action_experience_multiplier = await this.utilityCalculateExperienceMultiplier(person.person_students.length, person.person_skills.person_skills_gatherer_level);
      } else if (student_action.action_type_id == 2) {
        student_action.action_experience_multiplier = await this.utilityCalculateExperienceMultiplier(person.person_students.length, person.person_skills.person_skills_lumberjack_level);
      } else if (student_action.action_type_id == 3 || student_action.action_type_id == 4 || student_action.action_type_id == 5) {
        student_action.action_experience_multiplier = await this.utilityCalculateExperienceMultiplier(person.person_students.length, person.person_skills.person_skills_builder_level);
      } else {
        student_action.action_experience_multiplier = 1
      }
      await queryRunner.manager.save(Action, student_action);
    }
    action.action_type_id = 7;
    action.action_started_at = new Date();
    return await queryRunner.manager.save(Action, action);
  }

  async utilityCreateActionSingle(queryRunner, action: CreateActionDto, person: Person) {
    if (person.person_deleted_at) throw "Person is deceased!";
    if (person.person_action_queue.action_queue_current_action) throw "Action already in progress!";
    if (action.action_type_id == -1) {
      throw "Cannot perform action when teacher is set!"
    } else if (action.action_type_id == 1) {
      // Do nothing
    } else if (action.action_type_id == 2) {
      await this.utilityPrepareGetWoodAction(queryRunner, person);
    } else if (action.action_type_id == 3) {
      await this.utilityPrepareIncreaseStorageAction(queryRunner, person);
    } else if (action.action_type_id == 4) {
      await this.utilityPrepareIncreaseRoomsAction(queryRunner, person);
    } else if (action.action_type_id == 5) {
      await this.utilityPrepareCreateHouseAction(queryRunner, person);
    } else if (action.action_type_id == 6) {
      // Do nothing
    } else {
      throw "Invalid action_type_id, got: " + action.action_type_id;
    }
    action.action_started_at = new Date();
    return await queryRunner.manager.save(Action, action);
  }

  async utilityDoTheThing(queryRunner, action: CreateActionDto, person: Person) {
    if (person.person_deleted_at) throw "Person is deceased!";
    if (person.person_action_queue.action_queue_action_cooldown) throw "Action cooldown still in progress!";
    if (action.action_type_id == -1) {
      throw "Cannot perform action when teacher is set!"
    } else if (action.action_type_id == 1) {
      await this.getFood(queryRunner, person);
    } else if (action.action_type_id == 2) {
      await this.getWood(queryRunner, person);
    } else if (action.action_type_id == 3) {
      await this.increaseStorage(queryRunner, person);
    } else if (action.action_type_id == 4) {
      await this.increaseRooms(queryRunner, person);
    } else if (action.action_type_id == 5) {
      await this.createHouse(queryRunner, person);
    } else if (action.action_type_id == 6) {
      // Do nothing
    } else {
      throw "Invalid action_type_id, got: " + action.action_type_id;
    }
    const actionDoneAt = new Date()
    actionDoneAt.setHours(actionDoneAt.getHours() + 8);
    return await queryRunner.manager.save(ActionCooldown, {
      action_cooldown_queue_id: action.action_queue_id,
      action_cooldown_done_at: actionDoneAt
    });
  }

  async utilityPrepareGetWoodAction(queryRunner, person: Person, multiplier = 1) {
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    if (food.affected != 1) throw "Cannot decrement house resources!"
  }

  async utilityPrepareIncreaseStorageAction(queryRunner, person: Person, multiplier = 1) {
    const requiredWood = ( multiplier * ( person.person_house.house_storage / 3 ) ) + ( ( multiplier * ( multiplier + 1 ) ) / 2 );
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
    if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
  }

  async utilityPrepareIncreaseRoomsAction(queryRunner, person: Person, multiplier = 1) {
    const requiredWood = ( 2 * multiplier * person.person_house.house_rooms ) + ( multiplier * ( multiplier + 1 ) );
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
    if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
  }

  async utilityPrepareCreateHouseAction(queryRunner, person: Person, multiplier = 1) {
    const requiredWood = 12 * multiplier;
    const requiredFood = 3 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
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

  // async updateCancelPersonAction(person_id: number) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   let cancel;
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const person = await queryRunner.manager
  //       .createQueryBuilder(Person, "person")
  //       .innerJoinAndSelect("person.person_action_queue", "queue")
  //       .leftJoinAndSelect("queue.action_queue_current_action", "current_action", "current_action.started_at IS NOT NULL AND current_action.cancelled_at IS NULL AND current_action.completed_at IS NULL")
  //       .where("person.person_id = :id", { id: person_id })
  //       .getOne();
  //     if (!person.person_action_queue.action_queue_current_action) throw "No actions cancellable!";
  //     cancel = await queryRunner.manager.update(Action, person.person_action_queue.action_queue_current_action.action_id, { action_cancelled_at: new Date() });
  //     if (cancel.affected != 1) throw "Unable to cancel action!";
  //     await queryRunner.commitTransaction();
  //     await queryRunner.release();
  //     return [cancel];
  //   } catch (err) {
  //     console.log(err);
  //     await queryRunner.rollbackTransaction();
  //     await queryRunner.release();
  //     throw new BadRequestException(err);
  //   }
  // }

  async updateCancelAction(action_id: number, cancelQueue: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    let cancel;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (cancelQueue) {
        const action = await queryRunner.manager
          .createQueryBuilder(Action, "action")
          .innerJoinAndSelect("action.action_queue_current", "queue")
          .where("action.action_id = :id", { id: action_id })
          .getOne();
        // If action is the current action, also cancel queue
        if (action.action_started_at) {
          await queryRunner.manager.update(Action, {
            action_queue_id: action.action_queue_id,
            action_started_at: IsNull(),
            action_cancelled_at: IsNull(),
            action_completed_at: IsNull()
          }, {
            action_cancelled_at: new Date()
          });
        }
      }
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
      .innerJoinAndSelect("action.action_queue_previous", "queue")
      .leftJoinAndSelect("queue.action_queue_next_actions", "next_actions", "next_actions.started_at IS NULL AND next_actions.cancelled_at IS NULL AND next_actions.completed_at IS NULL")
      .innerJoinAndSelect("queue.action_queue_person", "person")
      .leftJoinAndSelect("person.person_house", "house")
      .leftJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
      .leftJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
      .where("action.started_at IS NOT NULL AND action.cancelled_at IS NULL AND action.completed_at IS NULL AND action.started_at + INTERVAL 8 HOUR < now()")
      .getMany();
    console.log("There are " + actions.length + " actions!")
    for (const action of actions) {
      try {
        if (action.action_queue_previous.action_queue_person.person_deleted_at) {
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
        if (action.action_queue_previous.action_queue_next_actions.length > 0) {
          try {
            await this.create(
              {
                action_id: action.action_queue_previous.action_queue_next_actions[0].action_id,
                action_type_id: action.action_queue_previous.action_queue_next_actions[0].action_type_id,
                action_queue_id: action.action_queue_previous.action_queue_next_actions[0].action_queue_id,
                action_experience_multiplier: action.action_queue_previous.action_queue_next_actions[0].action_experience_multiplier,
                action_started_at: new Date(),
                action_add_to_queue: 0
              }
            );
          } catch {
            for (const actions of action.action_queue_previous.action_queue_next_actions) {
              await this.updateCancelAction(actions.action_id, false);
            }
          }
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
        .innerJoinAndSelect("action.action_queue_previous", "queue")
        .innerJoinAndSelect("queue.action_queue_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("person.person_house", "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_queue_previous.action_queue_person.person_skills.person_skills_gatherer_level)
      const house = action.action_queue_previous.action_queue_person.person_house
      if (diceRoll && house.house_storage >= house.house_food.resource_volume + house.house_wood.resource_volume + 2) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(Resource, {
          resource_type_name: "food",
          resource_house_id: action.action_queue_previous.action_queue_person.person_house_id
        }, "resource_volume", 2);
        console.log("GetFoodDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("GetFoodNotDone")
      }
      await queryRunner.manager.increment(PersonSkills, {
        person_skills_id: action.action_queue_previous.action_queue_person.person_skills_id
      }, "person_skills_gatherer_experience", action.action_experience_multiplier);
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
        .innerJoinAndSelect("action.action_queue_previous", "queue")
        .innerJoinAndSelect("queue.action_queue_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("person.person_house", "house")
        .innerJoinAndSelect("house.house_food", "food", "food.type_name = 'food'")
        .innerJoinAndSelect("house.house_wood", "wood", "wood.type_name = 'wood'")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_queue_previous.action_queue_person.person_skills.person_skills_lumberjack_level)
      const house = action.action_queue_previous.action_queue_person.person_house
      if (diceRoll && house.house_storage >= house.house_food.resource_volume + house.house_wood.resource_volume + 1) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(Resource, {
          resource_type_name: "wood",
          resource_house_id: action.action_queue_previous.action_queue_person.person_house_id
        }, "resource_volume", 1);
        console.log("GetWoodDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("GetWoodNotDone")
      }
      await queryRunner.manager.increment(PersonSkills, {
        person_skills_id: action.action_queue_previous.action_queue_person.person_skills_id
      }, "person_skills_lumberjack_experience", action.action_experience_multiplier);
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
        .innerJoinAndSelect("action.action_queue_previous", "queue")
        .innerJoinAndSelect("queue.action_queue_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_queue_previous.action_queue_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(House, {
          house_id: action.action_queue_previous.action_queue_person.person_house_id
        }, "house_storage", 3);
        console.log("IncreaseStorageDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("IncreaseStorageNotDone")
      }
      await queryRunner.manager.increment(PersonSkills, {
        person_skills_id: action.action_queue_previous.action_queue_person.person_skills_id
      }, "person_skills_builder_experience", action.action_experience_multiplier);
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
        .innerJoinAndSelect("action.action_queue_previous", "queue")
        .innerJoinAndSelect("queue.action_queue_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_queue_previous.action_queue_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        await queryRunner.manager.increment(House, {
          house_id: action.action_queue_previous.action_queue_person.person_house_id
        }, "house_rooms", 1);
        console.log("IncreaseRoomsDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("IncreaseRoomsNotDone")
      }
      await queryRunner.manager.increment(PersonSkills, {
        person_skills_id: action.action_queue_previous.action_queue_person.person_skills_id
      }, "person_skills_builder_experience", action.action_experience_multiplier);
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
        .innerJoinAndSelect("action.action_queue_previous", "queue")
        .innerJoinAndSelect("queue.action_queue_person", "person")
        .leftJoinAndSelect("person.person_skills", "skills")
        .where("action.action_id = :id", { id: actionId })
        .getOne();
      const diceRoll = await this.utilityGetDiceRoll(action.action_queue_previous.action_queue_person.person_skills.person_skills_builder_level)
      if (diceRoll) {
        await queryRunner.manager.update(Action, actionId, { action_completed_at: new Date() });
        result = await this.houseService.createHouse(result, queryRunner, {
            house_family_id: action.action_queue_previous.action_queue_person.person_family_id,
            house_rooms: 2
          }
        )
        console.log("CreateHouseDone")
      } else {
        await queryRunner.manager.update(Action, actionId, { action_cancelled_at: new Date() });
        console.log("CreateHouseNotDone")
      }
      await queryRunner.manager.increment(PersonSkills, {
        person_skills_id: action.action_queue_previous.action_queue_person.person_skills_id
      }, "person_skills_builder_experience", action.action_experience_multiplier);
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

  async getFood(queryRunner, person: Person, multiplier = 1, experience_multiplier = 1) {
    // ToDo: Sort out how to implement multiplier on all functions
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_gatherer_level)
    const house = person.person_house
    if (diceRoll && house.house_storage >= house.house_food.resource_volume + house.house_wood.resource_volume + 2) {
      await queryRunner.manager.increment(Resource, {
        resource_type_name: "food",
        resource_house_id: person.person_house_id
      }, "resource_volume", 2);
      console.log("GetFoodDone")
    } else {
      console.log("GetFoodNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_gatherer_experience", experience_multiplier);
  }

  async getWood(queryRunner, person: Person, multiplier = 1, experience_multiplier = 1) {
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    if (food.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_lumberjack_level)
    if (diceRoll && person.person_house.house_storage >= person.person_house.house_food.resource_volume + person.person_house.house_wood.resource_volume + 1) {
      await queryRunner.manager.increment(Resource, {
        resource_type_name: "wood",
        resource_house_id: person.person_house_id
      }, "resource_volume", 1);
      console.log("GetWoodDone")
    } else {
      console.log("GetWoodNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_lumberjack_experience", experience_multiplier);
  }

  async increaseStorage(queryRunner, person: Person, multiplier = 1, experience_multiplier = 1) {
    const requiredWood = ( multiplier * ( person.person_house.house_storage / 3 ) ) + ( ( multiplier * ( multiplier + 1 ) ) / 2 );
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
    if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level)
    if (diceRoll) {
      await queryRunner.manager.increment(House, {
        house_id: person.person_house_id
      }, "house_storage", 3);
      console.log("IncreaseStorageDone")
    } else {
      console.log("IncreaseStorageNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_builder_experience", experience_multiplier);
  }

  async increaseRooms(queryRunner, person: Person, multiplier = 1, experience_multiplier = 1) {
    const requiredWood = ( 2 * multiplier * person.person_house.house_rooms ) + ( multiplier * ( multiplier + 1 ) );
    const requiredFood = 1 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
    if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level)
    if (diceRoll) {
      await queryRunner.manager.increment(House, {
        house_id: person.person_house_id
      }, "house_rooms", 1);
      console.log("IncreaseRoomsDone")
    } else {
      console.log("IncreaseRoomsNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_builder_experience", experience_multiplier);
  }

  async createHouse(queryRunner, person: Person, multiplier = 1, experience_multiplier = 1) {
    let result;
    const requiredWood = 12 * multiplier;
    const requiredFood = 3 * multiplier;
    if (person.person_house.house_food.resource_volume < requiredFood) throw "Not enough food, " + requiredFood + " required!"
    if (person.person_house.house_wood.resource_volume < requiredWood) throw "Not enough wood, " + requiredWood + " required!"
    const food = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "food",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredFood);
    const wood = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "wood",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredWood);
    if (food.affected != 1 && wood.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level)
    if (diceRoll) {
      result = await this.houseService.createHouse(result, queryRunner, {
          house_family_id: person.person_family_id,
          house_rooms: 2
        }
      )
      console.log("CreateHouseDone")
    } else {
      console.log("CreateHouseNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_builder_experience", experience_multiplier);
  }

  async utilityGetDiceRoll(skillLevel: number) {
    const blackRoll = Math.floor(12 * Math.random() + 1);
    const redRoll = Math.floor(12 * Math.random() + 1);
    return blackRoll + skillLevel > redRoll;
  }

  async utilityCalculateExperienceMultiplier(studentsLength: number, teacherSkillLevel: number) {
    if (teacherSkillLevel > studentsLength) {
      return teacherSkillLevel + 1 - studentsLength;
    } else {
      return 1;
    }
  }
}
