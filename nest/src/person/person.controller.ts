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
import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './entities/Person';

@Controller({
  path: 'person',
  version: '2',
})
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(@Body() body, @Req() req) {
    if(req.body?.house_id) {
      const person: CreatePersonDto = body;
      return await this.personService.createPerson(req.body.house_id, person);
    } else {
      const couple: CreatePersonDto[] = body;
      return await this.personService.createCouple(couple);
    }
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
    if(req.body?.name) {
      return this.personService.updateName(id, req.body.name);
    } else if (req.body?.house_id) {
      return this.personService.updateTravel(id, req.body.house_id);
    } else if (req.body?.person_teacher_id) {
      return this.personService.update(id, req.body);
    }
  }
}
