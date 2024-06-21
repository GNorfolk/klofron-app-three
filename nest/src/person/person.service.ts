import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Person } from './entities/Person';
import { PersonName } from './entities/PersonName';
import { CreatePersonDto } from './dto/create-person.dto';
import { Resource } from '../resource/entities/Resource';
import { House } from '../house/entities/House';
import { Action } from '../action/entities/Action';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
    private dataSource: DataSource
  ) {}

  async create(person: Person): Promise<Person> {
    return await this.personRepository.save(person);
  }

  async createPerson(house_id: number, person: CreatePersonDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const house = await queryRunner.manager
        .createQueryBuilder(House, "house")
        .leftJoinAndSelect("house.house_people", "person", "person.person_partner_id IS NOT NULL")
        .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
        .innerJoinAndSelect("house.house_food", "house_food", "house_food.type_name = 'food'")
        .where("house.house_id = :id", { id: house_id })
        .getOne();
      // TODO: Add where clause on house_people so that it doesn't return children
      // TODO: Log verbose error messaging and provide transaction id for debugging
      if (house.house_people.length < 2 || house.house_people.length > 2) throw "Wrong number of parents!"
      const mother = house.house_people.filter(person => { return person.person_gender === 'female' })[0]
      const father = house.house_people.filter(person => { return person.person_gender === 'male' })[0]
      if (mother.person_partner_id != father.person_id || father.person_partner_id != mother.person_id) throw "Parents aren't partners!"
      if (mother.person_family_id != father.person_family_id) throw "Not matching family_id!";
      person.person_family_id = mother.person_family_id
      if (mother.person_house_id != father.person_house_id) throw "Not matching house_id!";
      person.person_house_id = mother.person_house_id
      if (mother.person_age > 50) throw "Mother too old!"
      const house_people = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .where("person.house_id = :id", { id: house_id })
        .getMany()
      if (house_people.length >= house.house_rooms) throw "Not enough rooms!"
      if (house.house_food.resource_volume < 2) throw "Not enough food!"
      const resource = await queryRunner.manager.decrement(Resource, {
        resource_type_name: "food",
        resource_house_id: house_id
      }, "resource_volume", 2);
      if (resource.affected != 1) throw "Cannot decrement house resrouces!"
      if (mother.person_actions.length > 0 || father.person_actions.length > 0) throw "Parent already has an action in progress!"
      await queryRunner.manager.save(Action, {
        action_person_id: mother.person_id,
        action_type_id: 6
      });
      await queryRunner.manager.save(Action, {
        action_person_id: father.person_id,
        action_type_id: 6
      });
      person.person_gender = Math.floor(Math.random() * 2) == 0 ? 'male' : 'female'
      const person_name = await queryRunner.manager
        .createQueryBuilder(PersonName, "name")
        .where("name.person_name_gender = :str", { str: person.person_gender })
        .orderBy("RAND()")
        .limit(1)
        .getOne();
      person.person_name = person_name.person_name_name
      person.person_mother_id = mother.person_id
      person.person_father_id = father.person_id
      const result = await queryRunner.manager.save(Person, person);
      await queryRunner.manager.save(Resource, {
        resource_type_name: "food",
        resource_person_id: result.person_id
      });
      await queryRunner.manager.save(Resource, {
        resource_type_name: "wood",
        resource_person_id: result.person_id
      });
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

  async createCouple(couple: CreatePersonDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    let mother, father
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let eighteenDate = new Date();
      eighteenDate.setDate(eighteenDate.getDate() - 18);
      couple[0].person_created_at = eighteenDate;
      couple[1].person_created_at = eighteenDate;
      const mother_name = await queryRunner.manager
        .createQueryBuilder(PersonName, "name")
        .where("name.person_name_gender = :str", { str: couple[0].person_gender })
        .orderBy("RAND()")
        .limit(1)
        .getOne();
      couple[0].person_name = mother_name.person_name_name
      const father_name = await queryRunner.manager
        .createQueryBuilder(PersonName, "name")
        .where("name.person_name_gender = :str", { str: couple[1].person_gender })
        .orderBy("RAND()")
        .limit(1)
        .getOne();
      couple[1].person_name = father_name.person_name_name
      mother = await queryRunner.manager.save(Person, couple[0]);
      father = await queryRunner.manager.save(Person, couple[1]);
      await queryRunner.manager.update(Person, mother.person_id, { person_partner_id: father.person_id });
      await queryRunner.manager.update(Person, father.person_id, { person_partner_id: mother.person_id });
      await queryRunner.manager.save(Resource, {
        resource_type_name: "food",
        resource_person_id: mother.person_id,
        resource_volume: 3
      });
      await queryRunner.manager.save(Resource, {
        resource_type_name: "wood",
        resource_person_id: mother.person_id
      });
      await queryRunner.manager.save(Resource, {
        resource_type_name: "food",
        resource_person_id: father.person_id,
        resource_volume: 3
      });
      await queryRunner.manager.save(Resource, {
        resource_type_name: "wood",
        resource_person_id: father.person_id
      });
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [mother, father];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async findAll(query): Promise<Person[]> {
    let people = this.personRepository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person.person_family", "family")
      .leftJoinAndSelect("person.person_house", "house")
      .innerJoinAndSelect("person.person_food", "person_food", "person_food.type_name = 'food'")
      .innerJoinAndSelect("person.person_wood", "person_wood", "person_wood.type_name = 'wood'")
      .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
      .where("person.person_deleted_at IS NULL")
    if (query?.house_id) {
      people = people.andWhere("person.person_house_id = :house_id", { house_id: query.house_id })
    }
    if (query?.family_id) {
      people = people.andWhere("person.person_family_id = :family_id", { family_id: query.family_id })
    }
    return await people.getMany();
  }

  async findOne(id: number): Promise<Person> {
    const person = this.personRepository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person.person_skills", "skills")
      .innerJoinAndSelect("person.person_family", "person_family")
      .innerJoinAndSelect("person_family.family_people", "family_people")
      .innerJoinAndSelect("person.person_father", "father")
      .innerJoinAndSelect("person.person_mother", "mother")
      .innerJoinAndSelect("father.person_family", "father_family")
      .innerJoinAndSelect("mother.person_family", "mother_family")
      .leftJoinAndSelect("person.person_house", "house")
      .leftJoinAndSelect("house.house_address", "address")
      .leftJoinAndSelect("address.house_address_road", "road")
      .leftJoinAndSelect("person.person_partner", "partner")
      .leftJoinAndSelect("partner.person_family", "partner_family")
      .leftJoinAndSelect("person.person_wood", "wood", "wood.type_name = 'wood'") // TODO switch to inner join when all people have resources
      .leftJoinAndSelect("person.person_food", "food", "food.type_name = 'food'") // TODO switch to inner join when all people have resources
      .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
      .leftJoinAndSelect("person.person_proposals", "proposal", "proposal.accepted_at IS NULL AND proposal.cancelled_at IS NULL")
      .leftJoinAndSelect("proposal.proposal_offers", "offer", "offer.accepted_at IS NULL AND offer.deleted_at IS NULL")
      .leftJoinAndSelect("offer.proposal_offer_person", "offer_person")
      .leftJoinAndSelect("offer.proposal_offer_dowry", "dowry")
      .leftJoinAndSelect("dowry.proposal_dowry_person", "dowry_person")
      .where("person.person_id = :person_id", { person_id: id })
    return await person.getOne();
  }

  // curl --request PATCH localhost:5000/v2/person/41 --header "Content-Type: application/json" --data '{"name":"Cassie"}'
  async updateName(id: number, name: string) {
    return this.personRepository
      .createQueryBuilder()
      .update(Person)
      .set({ person_name: name })
      .where("id = :id", { id: id })
      .execute();
  }

  async updateTravel(person_id: number, house_id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const food = await queryRunner.manager
        .createQueryBuilder(Resource, "resource")
        .where("resource.person_id = :id", { id: person_id })
        .andWhere("resource.type_name = 'food'")
        .getOne();
      if (food.resource_volume < 1) throw "Not enough food to move!"
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .where("person.id = :id", { id: person_id })
        .getOne();
      if (person.person_house_id == house_id) throw "Already living at this address!"
      result = await queryRunner.manager.update(Person, person_id, { person_house_id: house_id });
      const resource = await queryRunner.manager.decrement(Resource, {
        resource_type_name: "food",
        resource_person_id: person_id
      }, "resource_volume", 1);
      if (resource.affected != 1) throw "Cannot decrement person resrouces!"
      const house = await queryRunner.manager
        .createQueryBuilder(House, "house")
        .leftJoinAndSelect("house.house_people", "person")
        .where("house.house_id = :id", { id: house_id })
        .getOne();
      if (house.house_people.length > house.house_rooms) throw "Too many people live at this address!";
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return [result];
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }
}
