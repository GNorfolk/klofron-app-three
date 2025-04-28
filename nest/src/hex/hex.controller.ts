import { Controller, Get, Param } from '@nestjs/common';
import { HexService } from './hex.service';

@Controller({
  path: 'hex',
  version: '1',
})
export class HexController {
  constructor(private readonly hexService: HexService) {}

  @Get()
  findAll() {
    return this.hexService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hexService.findOne(+id);
  }
}
