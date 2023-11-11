import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private personRepository: Repository<Person>) {}

  async create(person: Person): Promise<Person> {
    return await this.personRepository.save(person);
  }

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  async findOne(id: number): Promise<Person> {
    return await this.personRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
