import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/Trade';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
