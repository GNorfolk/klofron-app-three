import { Module } from '@nestjs/common';
import { MoveHouseService } from './move-house.service';
import { MoveHouseController } from './move-house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoveHouse } from './entities/MoveHouse';

@Module({
  imports: [TypeOrmModule.forFeature([MoveHouse])],
  controllers: [MoveHouseController],
  providers: [MoveHouseService],
})
export class MoveHouseModule {}
