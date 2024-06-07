import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/Action';
import { HouseModule } from '../house/house.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action]),
    HouseModule
  ],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
