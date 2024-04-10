import { Injectable } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/Family';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
  ) {}

  async findAll(query): Promise<Family[]> {
    let families = this.familyRepository
      .createQueryBuilder("family")
      .leftJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
    return await families.getMany();
  }

  async findOne(id: number): Promise<Family> {
    return await this.familyRepository.findOne({
      where: {
        family_id: id,
      },
    });
  }
}
