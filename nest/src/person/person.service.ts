import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Person } from './entities/Person';
import { CreatePersonDto } from './dto/create-person.dto';
import { Resource } from '../resource/entities/Resource';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
    private dataSource: DataSource
  ) {}

  async create(person: Person): Promise<Person> {
    return await this.personRepository.save(person);
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
      mother = await queryRunner.manager.save(Person, couple[0]);
      father = await queryRunner.manager.save(Person, couple[1]);
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
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return [mother, father];
  }

  async findAll(query): Promise<Person[]> {
    let people = this.personRepository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person.person_family", "family")
      .leftJoinAndSelect("person.person_house", "house")
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
      .innerJoinAndSelect("person.person_family", "person_family")
      .innerJoinAndSelect("person.person_father", "father")
      .innerJoinAndSelect("person.person_mother", "mother")
      .innerJoinAndSelect("father.person_family", "father_family")
      .innerJoinAndSelect("mother.person_family", "mother_family")
      .leftJoinAndSelect("person.person_house", "house")
      .leftJoinAndSelect("person.person_partner", "partner")
      .leftJoinAndSelect("partner.person_family", "partner_family")
      .leftJoinAndSelect("person.person_wood", "wood", "wood.type_name = 'wood'") // TODO switch to inner join when all people have resources
      .leftJoinAndSelect("person.person_food", "food", "food.type_name = 'food'") // TODO switch to inner join when all people have resources
      .leftJoinAndSelect("person.person_actions", "action", "action.cancelled_at IS NULL AND action.completed_at IS NULL")
      .where("person.person_id = :person_id", { person_id: id })
    return await person.getOne();
  }

  // curl --request PATCH localhost:5000/v2/person/41 --header "Content-Type: application/json" --data '{"name":"Cassie"}'
  update(id: number, body) {
    return this.personRepository
      .createQueryBuilder()
      .update(Person)
      .set({ person_name: body.name })
      .where("id = :id", { id: id })
      .execute();
  }
}
