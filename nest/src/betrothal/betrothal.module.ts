import { Module } from '@nestjs/common';
import { BetrothalService } from './betrothal.service';
import { BetrothalController } from './betrothal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Betrothal } from './entities/Betrothal';

@Module({
  imports: [TypeOrmModule.forFeature([Betrothal])],
  controllers: [BetrothalController],
  providers: [BetrothalService],
})
export class BetrothalModule {}
