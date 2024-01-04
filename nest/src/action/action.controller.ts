import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller({
  path: 'action',
  version: '2',
})
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionService.create(createActionDto);
  }

  @Get()
  findAll() {
    return this.actionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionService.findOne(+id);
  }
}
