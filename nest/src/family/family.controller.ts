import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Controller({
  path: 'family',
  version: '2',
})
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  findAll() {
    return this.familyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familyService.findOne(+id);
  }
}
