import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(@Body() person: Person): Promise<Person> {
    return await this.personService.create(person);
  }

  @Get()
  async findAll(): Promise<Person[]> {
    return await this.personService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return await this.personService.findOne(id);
  }
}
