import { Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { ToolController } from './tool.controller';
import { Tool } from './entities/Tool';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tool])],
  controllers: [ToolController],
  providers: [ToolService],
})
export class ToolModule {}
