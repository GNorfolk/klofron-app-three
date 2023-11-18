import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
  ) {}

  async findAll(): Promise<Family[]> {
    return await this.familyRepository.find();
  }

  async findOne(id: number): Promise<Family> {
    return await this.familyRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
