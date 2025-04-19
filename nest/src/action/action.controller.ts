import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/Action';

@Controller({
  path: 'action',
  version: '2',
})
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  async findAll(@Req() req): Promise<Action[]> {
    return await this.actionService.findAll(req.query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionService.findOne(+id);
  }

  @Patch()
  update(@Req() req) {
    if (req.body.action == "cancel") {
      return "Deprecated!"
    }
  }

  @Patch(':id')
  updateOne(@Req() req, @Param('id') id: number) {
    if (req.body.action == "cancel") {
      return this.actionService.updateCancelAction(id, true)
    }
  }
}

@Controller({
  path: 'action',
  version: '3',
})
export class ActionControllerv3 {
  constructor(private readonly actionService: ActionService) {}

  // curl --request POST localhost:5000/v3/action --header "Content-Type: application/json" --data '{"action_queue_id": 144, "action_type_id": 1}'
  @Post()
  async create(@Body() action: CreateActionDto) {
    return await this.actionService.create(action);
  }

  // curl --request PATCH localhost:5000/v3/action
  @Patch()
  update(@Req() req) {
    return this.actionService.updateQueueNextAction()
  }
}
