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

  // curl --request POST localhost:5000/v2/house --header "Content-Type: application/json" --data '{"house_name": "georgetest", "house_family_id": 43, "house_rooms": 2}'
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

  @Patch(':id')
  update(@Param('id') id: number, @Req() req) {
    return this.houseService.update(id, req.body);
  }
}
