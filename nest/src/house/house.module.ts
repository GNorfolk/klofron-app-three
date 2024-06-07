import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/House';
import { HouseRoadName } from './entities/HouseRoadName';
import { HouseRoadType } from './entities/HouseRoadType';
import { HouseRoad } from './entities/HouseRoad';
import { HouseAddress } from './entities/HouseAddress';

@Module({
  imports: [TypeOrmModule.forFeature([House, HouseRoadName, HouseRoadType, HouseRoad, HouseAddress])],
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService]
})
export class HouseModule {}
