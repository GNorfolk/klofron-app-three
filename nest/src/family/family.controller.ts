import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { Family } from './entities/Family';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Controller({
  path: 'family',
  version: '2',
})
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  // curl --request POST localhost:5000/v2/family --header "Content-Type: application/json" --data '{"family_name": "georgetest", "family_user_id": 9}'
  @Post()
  async create(@Body() family: CreateFamilyDto): Promise<CreateFamilyDto> {
    return await this.familyService.create(family);
  }

  @Get()
  findAll(@Req() req) {
    return this.familyService.findAll(req.query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(+id);
  }
}
