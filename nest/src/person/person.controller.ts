import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  Patch,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from './entities/Person';

@Controller({
  path: 'person',
  version: '2',
})
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(@Body() person: Person): Promise<Person> {
    return await this.personService.create(person);
  }

  @Get()
  async findAll(@Req() req): Promise<Person[]> {
    return await this.personService.findAll(req.query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Person> {
    return await this.personService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Req() req) {
    return this.personService.update(id, req.body);
  }
}
