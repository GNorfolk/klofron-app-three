import { Module } from '@nestjs/common';
import { HexService } from './hex.service';
import { HexController } from './hex.controller';
import { Hex } from './entities/Hex';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HexBonus } from './entities/HexBonus';

@Module({
  imports: [TypeOrmModule.forFeature([Hex, HexBonus])],
  controllers: [HexController],
  providers: [HexService],
})
export class HexModule {}
