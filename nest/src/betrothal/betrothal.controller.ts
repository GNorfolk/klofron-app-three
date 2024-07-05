import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BetrothalService } from './betrothal.service';
import { CreateBetrothalDto } from './dto/create-betrothal.dto';
import { UpdateBetrothalDto } from './dto/update-betrothal.dto';
import { Betrothal } from './entities/Betrothal';

@Controller({
  path: 'betrothal',
  version: '2',
})
export class BetrothalController {
  constructor(private readonly betrothalService: BetrothalService) {}

  @Get()
  async findAll(): Promise<Betrothal[]> {
    return await this.betrothalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Betrothal> {
    return await this.betrothalService.findOne(+id);
  }

  @Post()
  async create(@Body() betrothal: CreateBetrothalDto) {
    return await this.betrothalService.create(betrothal);
  }
}
