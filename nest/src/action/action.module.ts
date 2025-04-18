import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController, ActionControllerv3 } from './action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/Action';
import { ActionQueue } from './entities/ActionQueue';
import { HouseModule } from '../house/house.module';
import { ActionCooldown } from './entities/ActionCooldown';
import { ActionDiceroll } from './entities/ActionDiceroll';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, ActionQueue, ActionCooldown, ActionDiceroll]),
    HouseModule
  ],
  controllers: [ActionController, ActionControllerv3],
  providers: [ActionService],
})
export class ActionModule {}
