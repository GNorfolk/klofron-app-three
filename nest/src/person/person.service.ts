import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/Person';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
  ) {}

  async create(person: Person): Promise<Person> {
    return await this.personRepository.save(person);
  }

  async findAll(query): Promise<Person[]> {
    let people = await this.personRepository
      .createQueryBuilder("person")
      .innerJoinAndSelect("person.person_family", "family")
      .innerJoinAndSelect("person.person_house", "house")
    if (query?.house_id) {
      people = people.where("person.person_house_id = :house_id", { house_id: query.house_id })
    }
    return people.getMany();
  }

  async findOne(id: number): Promise<Person> {
    return await this.personRepository.findOne({
      where: {
        person_id: id,
      },
    });
  }
}
