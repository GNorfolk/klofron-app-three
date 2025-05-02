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
    const existingHex = await this.hexRepository.findOne({
      where: {
        hex_q_coordinate: createHexDto.hex_q_coordinate,
        hex_r_coordinate: createHexDto.hex_r_coordinate,
        hex_s_coordinate: createHexDto.hex_s_coordinate
      },
    });

    if (existingHex) {
    // Update the existing hex
    const updated = this.hexRepository.merge(existingHex, createHexDto);
    return this.hexRepository.save(updated);
  } else {
    // Create a new hex
    const newHex = this.hexRepository.create(createHexDto);
    return this.hexRepository.save(newHex);
  }
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
