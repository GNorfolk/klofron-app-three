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

  async create(family: CreateFamilyDto): Promise<CreateFamilyDto> {
    return await this.familyRepository.save(family);
  }

  async findAll(query): Promise<Family[]> {
    let families = this.familyRepository
      .createQueryBuilder("family")
      if (query?.show_empty && query.show_empty == "true") {
        families = families.leftJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      } else {
        families = families.innerJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      }
      if (query?.user_id) {
        families = families.where("family.family_user_id = :id", { id: query.user_id })
      }
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
