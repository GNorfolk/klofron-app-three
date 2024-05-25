import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/House';
import { HouseRoadName } from './entities/HouseRoadName';
import { HouseRoadType } from './entities/HouseRoadType';

@Module({
  imports: [TypeOrmModule.forFeature([House, HouseRoadName, HouseRoadType])],
  controllers: [HouseController],
  providers: [HouseService],
})
export class HouseModule {}
