import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Action } from './entities/Action';
import { Person } from '../person/entities/Person';
import { PersonSkills } from '../person/entities/PersonSkills';
import { Resource } from '../resource/entities/Resource';
import { House } from '../house/entities/House';
import { HouseService } from '../house/house.service';
import { ActionCooldown } from './entities/ActionCooldown';
import { ActionQueue } from './entities/ActionQueue';
import { ActionDiceroll } from './entities/ActionDiceroll';
import { HexBonus } from 'src/hex/entities/HexBonus';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private actionRepository: Repository<Action>,
    @InjectRepository(ActionCooldown) private actionCooldownRepository: Repository<ActionCooldown>,
    @InjectRepository(ActionDiceroll) private actionDicerollRepository: Repository<ActionDiceroll>,
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
        .innerJoinAndSelect("person.person_action_queue", "queue")
        .leftJoinAndSelect("queue.action_queue_current_action", "current_action", "current_action.started_at IS NOT NULL AND current_action.cancelled_at IS NULL AND current_action.completed_at IS NULL")
        .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
        .leftJoinAndSelect("person.person_house", "house")
        .leftJoinAndSelect("house.house_hex", "hex")
        .leftJoinAndSelect("hex.hex_bonuses", "bonus")
        .leftJoinAndSelect("person.person_skills", "skills")
        .leftJoinAndSelect("house.house_resources", "resources")
        .leftJoinAndSelect("person.person_students", "student")
        .leftJoinAndSelect("student.person_action_queue", "student_queue")
        .leftJoinAndSelect("student.person_skills", "student_skills")
        .leftJoinAndSelect("student.person_house", "student_house")
        .leftJoinAndSelect("student_house.house_resources", "student_resources")
        .leftJoinAndSelect("student_house.house_hex", "student_house_hex")
        .leftJoinAndSelect("student_house_hex.hex_bonuses", "student_house_bonuses")
        .leftJoinAndSelect("student_queue.action_queue_action_cooldown", "student_cooldown", "student_cooldown.created_at IS NOT NULL AND student_cooldown.done_at > NOW()")
        .where("person.person_action_queue_id = :id", { id: action.action_queue_id })
        .getOne();
      if (!person) throw "Action person cannot be found on the backend!"
      if (action?.action_add_to_queue) {
        if (person.person_teacher_id) {
          throw "Cannot queue action when teacher is set!"
        } else if (person.person_action_queue.action_queue_action_cooldown) {
          result = await queryRunner.manager.save(Action, action);
        } else {
          throw "Cannot add action to queue when person is not in cooldown already!"
        }
      } else if (person.person_students.length > 0) {
        result = await this.utilityPerformActionStudents(queryRunner, action, person)
      } else {
        result = await this.utilityPerformActionSingle(queryRunner, action, person, person.person_action_queue, null)
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async utilityPerformActionStudents(queryRunner, action: CreateActionDto, person: Person) {
    const aliveStudents = person.person_students.filter(student => student.person_deleted_at == null)
    if (person.person_students.length != aliveStudents.length) throw "One or more students are deceased!"
    const availableStudents = person.person_students.filter(student => !student.person_action_queue.action_queue_action_cooldown)
    if (person.person_students.length != availableStudents.length) throw "One or more students have running actions!"
    const colocatedStudents = person.person_students.filter(student => student.person_house_id == person.person_house_id)
    if (person.person_students.length != colocatedStudents.length) throw "One or more students are not colocated with their teacher!"
    for (const student of person.person_students) {
      let student_action = structuredClone(action);
      student_action.action_queue_id = student.person_action_queue_id;
      student_action.action_experience_multiplier = await this.utilityCalculateExperienceMultiplier(person.person_students.length, student_action.action_type_id, person.person_skills);
      await this.utilityPerformActionSingle(queryRunner, student_action, student, student.person_action_queue, person.person_id)
    }
    const actionDoneAt = new Date()
    actionDoneAt.setHours(actionDoneAt.getHours() + 8);
    return await queryRunner.manager.save(ActionCooldown, {
      action_cooldown_queue_id: action.action_queue_id,
      action_cooldown_done_at: actionDoneAt,
      action_cooldown_duration_hours: 8
    });
  }

  async utilityPerformActionSingle(queryRunner, action: CreateActionDto, person: Person, queue: ActionQueue, teacherId: number | null) {
    let diceroll;
    if (person.person_deleted_at) throw "Person is deceased!";
    if (queue.action_queue_action_cooldown) throw "Action cooldown still in progress!";
    if (person.person_teacher_id && person.person_teacher_id != teacherId) throw "Cannot perform action when teacher is set";
    const multiplier = action.action_experience_multiplier
    // Might need to do ?? [] if nothing returned
    const bonus = person.person_house.house_hex.hex_bonuses
    if (action.action_type_id == -1) {
      throw "Cannot perform action when teacher is set!"
    } else if (action.action_type_id == 1) {
      diceroll = await this.getBerry(queryRunner, person, multiplier, bonus);
    } else if (action.action_type_id == 2) {
      diceroll = await this.getBamboo(queryRunner, person, multiplier, bonus);
    } else if (action.action_type_id == 3) {
      diceroll = await this.increaseStorage(queryRunner, person, multiplier);
    } else if (action.action_type_id == 4) {
      diceroll = await this.increaseRooms(queryRunner, person, multiplier);
    } else if (action.action_type_id == 5) {
      diceroll = await this.createHouse(queryRunner, person, multiplier);
    } else if (action.action_type_id == 6) {
      // Do nothing
    } else {
      throw "Invalid action_type_id, got: " + action.action_type_id;
    }
    const actionDoneAt = new Date()
    actionDoneAt.setHours(actionDoneAt.getHours() + diceroll.action_diceroll_cooldown_hours);
    if (action?.action_id) {
      await queryRunner.manager.update(Action, action.action_id, {
        action_started_at: new Date(),
        action_completed_at: new Date(),
      })
    }
    const cooldown = await queryRunner.manager.save(ActionCooldown, {
      action_cooldown_queue_id: action.action_queue_id,
      action_cooldown_done_at: actionDoneAt,
      action_cooldown_duration_hours: diceroll.action_diceroll_cooldown_hours,
      action_cooldown_diceroll_id: diceroll.action_diceroll_id
    });
    cooldown.action_cooldown_diceroll = diceroll
    return cooldown;
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

  async updateQueueNextAction() {
    const cooldowns = await this.actionCooldownRepository
      .createQueryBuilder("cooldown")
      .innerJoinAndSelect("cooldown.action_cooldown_queue", "queue")
      .leftJoinAndSelect("queue.action_queue_actions", "actions", "actions.started_at is null and actions.cancelled_at is null")
      .innerJoinAndSelect("queue.action_queue_person", "person")
      .leftJoinAndSelect("person.person_house", "house")
      .leftJoinAndSelect("house.house_hex", "hex")
      .leftJoinAndSelect("person.person_skills", "skills")
      .leftJoinAndSelect("person.person_students", "students")
      .leftJoinAndSelect("house.house_resources", "resources")
      .where("cooldown.done_at < NOW() AND cooldown.deleted_at is null")
      .getMany();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    for (const cooldown of cooldowns) {
      const action = cooldown.action_cooldown_queue.action_queue_actions[0]
      if (action) {
        const person = await queryRunner.manager
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_action_queue", "queue")
          .leftJoinAndSelect("queue.action_queue_current_action", "current_action", "current_action.started_at IS NOT NULL AND current_action.cancelled_at IS NULL AND current_action.completed_at IS NULL")
          .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
          .leftJoinAndSelect("person.person_house", "house")
          .leftJoinAndSelect("house.house_hex", "hex")
          .leftJoinAndSelect("hex.hex_bonuses", "bonus")
          .leftJoinAndSelect("person.person_skills", "skills")
          .leftJoinAndSelect("house.house_resources", "resources")
          .leftJoinAndSelect("person.person_students", "student")
          .leftJoinAndSelect("student.person_action_queue", "student_queue")
          .leftJoinAndSelect("student.person_skills", "student_skills")
          .leftJoinAndSelect("student.person_house", "student_house")
          .leftJoinAndSelect("student_house.house_resources", "student_resources")
          .leftJoinAndSelect("student_house.house_hex", "student_house_hex")
          .leftJoinAndSelect("student_house_hex.hex_bonuses", "student_house_bonuses")
          .leftJoinAndSelect("student_queue.action_queue_action_cooldown", "student_cooldown", "student_cooldown.created_at IS NOT NULL AND student_cooldown.done_at > NOW()")
          .where("person.person_id = :id", { id: cooldown.action_cooldown_queue.action_queue_person.person_id })
          .getOne();
        try {
          await queryRunner.startTransaction();
          await queryRunner.manager.update(ActionCooldown, cooldown.action_cooldown_id, { action_cooldown_deleted_at: new Date() });
          if (person.person_students.length > 0) {
            await this.utilityPerformActionStudents(queryRunner, action, person)
          } else {
            await this.utilityPerformActionSingle(queryRunner, action, person, cooldown.action_cooldown_queue, null)
          }
          await queryRunner.commitTransaction();
        } catch (err) {
          console.log(err)
          await queryRunner.rollbackTransaction();
        }
      } else {
        await queryRunner.manager.update(ActionCooldown, cooldown.action_cooldown_id, { action_cooldown_deleted_at: new Date() });
      }
    }
    await queryRunner.release();
    return "Done: " + cooldowns.length
  }

  async getBerry(queryRunner, person: Person, experience_multiplier = 1, hexBonuses: HexBonus[]) {
    const hexBonus = await this.utilityGetBonusValue(hexBonuses, 'berry')
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_gatherer_level, hexBonus)
    const house = person.person_house
    if (diceRoll.action_diceroll_success && house.house_storage >= house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume + house.house_resources.find(r => r.resource_type_name === 'bamboo')?.resource_volume + 2) {
      await queryRunner.manager.increment(Resource, {
        resource_type_name: "berry",
        resource_house_id: person.person_house_id
      }, "resource_volume", 2);
      console.log("getBerryDone")
    } else {
      console.log("getBerryNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_gatherer_experience", experience_multiplier);
    return diceRoll;
  }

  async getBamboo(queryRunner, person: Person, experience_multiplier = 1, hexBonuses: HexBonus[]) {
    const hexBonus = await this.utilityGetBonusValue(hexBonuses, 'bamboo')
    const requiredBerry = 1;
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume < requiredBerry) throw "Not enough berry, " + requiredBerry + " required!"
    const berry = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "berry",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBerry);
    if (berry.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_lumberjack_level, hexBonus)
    if (diceRoll.action_diceroll_success && person.person_house.house_storage >= person.person_house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume + person.person_house.house_resources.find(r => r.resource_type_name === 'bamboo')?.resource_volume + 1) {
      await queryRunner.manager.increment(Resource, {
        resource_type_name: "bamboo",
        resource_house_id: person.person_house_id
      }, "resource_volume", 1);
      console.log("getBambooDone")
    } else {
      console.log("getBambooNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_lumberjack_experience", experience_multiplier);
    return diceRoll;
  }

  async increaseStorage(queryRunner, person: Person, experience_multiplier = 1) {
    const requiredBamboo = ( person.person_house.house_storage / 3 ) + 1;
    const requiredBerry = 1;
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume < requiredBerry) throw "Not enough berry, " + requiredBerry + " required!"
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'bamboo')?.resource_volume < requiredBamboo) throw "Not enough bamboo, " + requiredBamboo + " required!"
    const berry = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "berry",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBerry);
    const bamboo = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "bamboo",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBamboo);
    if (berry.affected != 1 && bamboo.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level, -1)
    if (diceRoll.action_diceroll_success) {
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
    return diceRoll;
  }

  async increaseRooms(queryRunner, person: Person, experience_multiplier = 1) {
    const hexBonus = 0
    const requiredBamboo = ( 2 * person.person_house.house_rooms ) + 2;
    const requiredBerry = 1;
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume < requiredBerry) throw "Not enough berry, " + requiredBerry + " required!"
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'bamboo')?.resource_volume < requiredBamboo) throw "Not enough bamboo, " + requiredBamboo + " required!"
    const berry = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "berry",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBerry);
    const bamboo = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "bamboo",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBamboo);
    if (berry.affected != 1 && bamboo.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level, -1)
    if (diceRoll.action_diceroll_success) {
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
    return diceRoll;
  }

  async createHouse(queryRunner, person: Person, experience_multiplier = 1) {
    let result;
    const requiredBamboo = 0;
    const requiredBerry = 0;
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'berry')?.resource_volume < requiredBerry) throw "Not enough berry, " + requiredBerry + " required!"
    if (person.person_house.house_resources.find(r => r.resource_type_name === 'bamboo')?.resource_volume < requiredBamboo) throw "Not enough bamboo, " + requiredBamboo + " required!"
    const berry = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "berry",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBerry);
    const bamboo = await queryRunner.manager.decrement(Resource, {
      resource_type_name: "bamboo",
      resource_house_id: person.person_house_id
    }, "resource_volume", requiredBamboo);
    if (berry.affected != 1 && bamboo.affected != 1) throw "Cannot decrement house resources!"
    const diceRoll = await this.utilityGetDiceRoll(person.person_skills.person_skills_builder_level, -1)
    if (diceRoll.action_diceroll_success) {
      result = await this.houseService.createHouse(result, queryRunner, {
          house_family_id: person.person_family_id,
          house_rooms: 0,
          house_storage: 0
        }
      )
      console.log("CreateHouseDone")
    } else {
      console.log("CreateHouseNotDone")
    }
    await queryRunner.manager.increment(PersonSkills, {
      person_skills_id: person.person_skills_id
    }, "person_skills_builder_experience", experience_multiplier);
    return diceRoll;
  }

  async utilityGetDiceRoll(skillLevel: number, hexBonus: number) {
    const bonusMap: { [key: number]: number } = { 1: 9, 2: 3, 3: -3, [-1]: 0 };
    const blackRoll = Math.floor(12 * Math.random() + 1);
    const redRoll = Math.floor(12 * Math.random() + 1);
    const adjustedBlackRoll = blackRoll + skillLevel
    const adjustedRedRoll = Math.max(1, redRoll + bonusMap[hexBonus]);
    const diff = Math.floor((adjustedBlackRoll - adjustedRedRoll) / 3)
    return this.actionDicerollRepository.save({
      action_diceroll_created_at: new Date(),
      action_diceroll_success: adjustedBlackRoll > adjustedRedRoll,
      action_diceroll_black_roll: blackRoll,
      action_diceroll_skill_level: skillLevel,
      action_diceroll_red_roll: redRoll,
      action_diceroll_hex_bonus: bonusMap[hexBonus],
      action_diceroll_cooldown_hours: diff > 0 ? 8 - diff : 8
    });
  }

  async utilityCalculateExperienceMultiplier(studentsLength: number, actionTypeId: number, teacherSkills: PersonSkills) {
    let teacherSkillLevel;
    if (actionTypeId == 1) {
      teacherSkillLevel = teacherSkills.person_skills_gatherer_level
    } else if (actionTypeId == 2) {
      teacherSkillLevel = teacherSkills.person_skills_lumberjack_level
    } else if (actionTypeId == 3 || actionTypeId == 4 || actionTypeId == 5) {
      teacherSkillLevel = teacherSkills.person_skills_builder_level
    } else {
      teacherSkillLevel = 1
    }
    if (teacherSkillLevel > studentsLength) {
      return teacherSkillLevel + 1 - studentsLength;
    } else {
      return 1;
    }
  }

  async utilityGetBonusValue(bonuses: HexBonus[], hex_bonus_type: string): Promise<number> {
    return bonuses.find(b => b.hex_bonus_type === hex_bonus_type)?.hex_bonus_value ?? 0;
  }
}
