import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BetrothalService } from './betrothal.service';
import { CreateBetrothalDto } from './dto/create-betrothal.dto';
import { CreateBetrothalDowryDto } from './dto/create-betrothal-dowry.dto';
import { UpdateBetrothalDto } from './dto/update-betrothal.dto';
import { Betrothal } from './entities/Betrothal';

@Controller({
  path: 'betrothal',
  version: '2',
})
export class BetrothalController {
  constructor(private readonly betrothalService: BetrothalService) {}

  @Post()
  async create(@Body() createBetrothalDto: CreateBetrothalDto, @Body() createBetrothalDowryDto: CreateBetrothalDowryDto, ) {
    return await this.betrothalService.create(createBetrothalDto, createBetrothalDowryDto);
  }

  @Get()
  async findAll(): Promise<Betrothal[]> {
    return await this.betrothalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Betrothal> {
    return await this.betrothalService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') betrothalId: string, @Body() body: any) {
    return await this.betrothalService.update(+betrothalId, body.accepter_person_id);
  }
}
