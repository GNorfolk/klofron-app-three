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

  async findAll(filters?: {
    qMin?: number;
    qMax?: number;
    rMin?: number;
    rMax?: number;
    sMin?: number;
    sMax?: number;
  }) {
    const query = this.hexRepository.createQueryBuilder('hex');

    if (filters?.qMin !== undefined) {
      query.andWhere('hex.hex_q_coordinate >= :qMin', { qMin: filters.qMin });
    }
    if (filters?.qMax !== undefined) {
      query.andWhere('hex.hex_q_coordinate <= :qMax', { qMax: filters.qMax });
    }

    if (filters?.rMin !== undefined) {
      query.andWhere('hex.hex_r_coordinate >= :rMin', { rMin: filters.rMin });
    }
    if (filters?.rMax !== undefined) {
      query.andWhere('hex.hex_r_coordinate <= :rMax', { rMax: filters.rMax });
    }

    if (filters?.sMin !== undefined) {
      query.andWhere('hex.hex_s_coordinate >= :sMin', { sMin: filters.sMin });
    }
    if (filters?.sMax !== undefined) {
      query.andWhere('hex.hex_s_coordinate <= :sMax', { sMax: filters.sMax });
    }

    return await query.getMany();
  }

  async findOne(id: number) {
    return await this.hexRepository.findOneBy({
      hex_id: id,
  })
  }
}
