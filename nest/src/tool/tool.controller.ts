import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';

@Controller({
  path: 'tool',
  version: '1',
})
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post()
  async create(@Body() createToolDto: CreateToolDto) {
    return await this.toolService.create(createToolDto);
  }

  @Get()
  async findAll() {
    return await this.toolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.toolService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return await this.toolService.update(+id, updateToolDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.toolService.remove(+id);
  }
}
