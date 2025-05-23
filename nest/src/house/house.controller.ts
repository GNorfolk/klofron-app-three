import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller({
  path: 'house',
  version: '2',
})
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post()
  async create(@Body() house: CreateHouseDto) {
    return await this.houseService.create(house);
  }

  @Get()
  findAll(@Req() req) {
    return this.houseService.findAll(req.query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(+id);
  }
}
