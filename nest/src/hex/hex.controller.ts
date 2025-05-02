import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { HexService } from './hex.service';
import { CreateHexDto } from './dto/create-hex.dto';

@Controller({
  path: 'hex',
  version: '1',
})
export class HexController {
  constructor(private readonly hexService: HexService) {}

  @Post()
  async create(@Body() hex: CreateHexDto) {
    return await this.hexService.create(hex);
  }

  @Get()
  findAll() {
    return this.hexService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hexService.findOne(+id);
  }
}
