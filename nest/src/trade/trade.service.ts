import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './entities/Trade';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(Trade) private tradeRepository: Repository<Trade>,
  ) {}

  create(createTradeDto: CreateTradeDto) {
    return 'This action adds a new trade';
  }

  async findAll(query): Promise<Trade[]> {
    let trades = this.tradeRepository
      .createQueryBuilder("trade")
    if (query?.house_id) {
      trades = trades.where("trade.trade_house_id = :id", { id: query.house_id })
    }
    return await trades.getMany();
  }

  async findOne(id: number): Promise<Trade> {
    const trade = this.tradeRepository
      .createQueryBuilder("trade")
      .where("trade.trade_id = :id", { id: id })
    return await trade.getOne();
  }

  update(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action updates a #${id} trade`;
  }

  remove(id: number) {
    return `This action removes a #${id} trade`;
  }
}
