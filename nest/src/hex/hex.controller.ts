import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { HexService } from './hex.service';
import { CreateHexDto } from './dto/create-hex.dto';
import { Hex } from './entities/Hex';

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
  async findAll(@Query() query): Promise<Hex[]> {
    const { q, r, s, max } = query;
    const qNum = Number(q);
    const rNum = Number(r);
    const sNum = Number(s);
    const maxNum = Number(max);

    return this.hexService.findAll({
      qMin: qNum - maxNum,
      qMax: qNum + maxNum,
      rMin: rNum - maxNum,
      rMax: rNum + maxNum,
      sMin: sNum - maxNum,
      sMax: sNum + maxNum,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hexService.findOne(+id);
  }
}
