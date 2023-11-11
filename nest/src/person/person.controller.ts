import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  async findAll(): Promise<Person[]> {
    return await this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
