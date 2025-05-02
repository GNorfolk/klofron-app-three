import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Hex } from './entities/Hex';
import { CreateHexDto } from './dto/create-hex.dto';

@Injectable()
export class HexService {
  constructor(
    @InjectRepository(Hex) private hexRepository: Repository<Hex>,
  ) {}

  async create(createHexDto: CreateHexDto) {
    return await this.hexRepository.save(createHexDto);
  }

  async findAll() {
    return await this.hexRepository.find()
  }

  async findOne(id: number) {
    return await this.hexRepository.findOneBy({
      hex_id: id,
  })
  }
}
