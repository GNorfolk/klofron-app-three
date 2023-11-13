import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FamilyService } from './family.service';

@Controller('family')
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familyService.remove(+id);
  }
}
