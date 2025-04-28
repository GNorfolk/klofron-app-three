import { Module } from '@nestjs/common';
import { HexService } from './hex.service';
import { HexController } from './hex.controller';
import { Hex } from './entities/Hex';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Hex])],
  controllers: [HexController],
  providers: [HexService],
})
export class HexModule {}
