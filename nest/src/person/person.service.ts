import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private personRepository: Repository<Person>) {}

  async findAll(): Promise<Person[]> {
    return await this.personRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
