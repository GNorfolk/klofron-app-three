import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ResourceService } from './resource.service';

@Controller({
  path: 'resource',
  version: '2',
})
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  @Get(':house_id')
  findOne(@Param('house_id') house_id: string) {
    return this.resourceService.findByHouseId(+house_id);
  }

  @Patch()
  update(@Req() req) {
    if (req.body.action == "decrement") {
      return this.resourceService.updateDecrementResource(req.body.house_id, req.body.type_name)
    } else {
      return this.resourceService.updateMoveResource(req.body);
    }
  }
}
