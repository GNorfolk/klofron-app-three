import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool, ToolHandle, ToolMaterial } from './entities/Tool';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool) private toolRepository: Repository<Tool>,
    private dataSource: DataSource
  ) {}

  async create(tool: CreateToolDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const materialValues: Record<ToolMaterial, number> = {
        [ToolMaterial.BASALT]: 12,
        [ToolMaterial.FLINT]: 8,
        [ToolMaterial.SANDSTONE]: 4,
      };
      const handleValues: Record<ToolHandle, number> = {
        [ToolHandle.OAK]: 12,
        [ToolHandle.BIRCH]: 8,
        [ToolHandle.SPRUCE]: 4,
      };
      tool.durability = materialValues[tool.material] * handleValues[tool.handle];
      result = await queryRunner.manager.save(Tool, tool);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<Tool[]> {
    return await this.toolRepository
      .createQueryBuilder("tool")
      .getMany();
  }

  async findOne(id: number): Promise<Tool> {
    return await this.toolRepository
      .createQueryBuilder("tool")
      .where("tool.id = :id", { id: id })
      .getOne();
    }

  async update(id: number, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
  }

async remove(id: number) {
    return `This action removes a #${id} tool`;
  }
}
