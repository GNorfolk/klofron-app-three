import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MoveHouseService } from './move-house.service';
import { CreateMoveHouseDto } from './dto/create-move-house.dto';
import { UpdateMoveHouseDto } from './dto/update-move-house.dto';

@Controller({
  path: 'move-house',
  version: '2',
})
export class MoveHouseController {
  constructor(private readonly moveHouseService: MoveHouseService) {}

  @Post()
  create(@Body() createMoveHouseDto: CreateMoveHouseDto) {
    return this.moveHouseService.create(createMoveHouseDto);
  }

  @Get()
  findAll() {
    return this.moveHouseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moveHouseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoveHouseDto: UpdateMoveHouseDto) {
    return this.moveHouseService.update(+id, updateMoveHouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moveHouseService.remove(+id);
  }
}
