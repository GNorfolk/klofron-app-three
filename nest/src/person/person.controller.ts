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

  // curl --request POST localhost:5000/v2/person --header "Content-Type: application/json" --data '[{"person_name": "one", "person_family_id": 44, "person_father_id": 1, "person_mother_id": 2, "person_gender": "female"},{"person_name": "two", "person_family_id": 44, "person_father_id": 1, "person_mother_id": 2, "person_gender": "male"}]'
  @Post()
  async createCouple(@Body() couple: CreatePersonDto[]) {
    return await this.personService.createCouple(couple);
  }

  @Post(':id')
  async createPerson(@Param('id') id: number, @Body() person: CreatePersonDto) {
    return await this.personService.createPerson(id, person);
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
    }
  }
}
