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
      .leftJoinAndSelect("family.family_houses", "house")
      if (query?.show_empty && query.show_empty == "true") {
        families = families.leftJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      } else {
        families = families.innerJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      }
      if (query?.user_id) {
        families = families
          .where("family.family_user_id = :id", { id: query.user_id })
          .andWhere("family.family_deleted_at IS NULL")
      } else {
        families = families.where("family.family_deleted_at IS NULL")
      }
    return await families.getMany();
  }

  async findOne(id: number): Promise<Family> {
    let family = this.familyRepository
      .createQueryBuilder("family")
      .leftJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      .leftJoinAndSelect("person.person_resources", "person_resources")
      .leftJoinAndSelect("person.person_action_queue", "queue")
      .leftJoinAndSelect("queue.action_queue_action_cooldown", "cooldown", "cooldown.created_at IS NOT NULL AND cooldown.done_at > NOW()")
      .leftJoinAndSelect("family.family_houses", "house")
      .leftJoinAndSelect("house.house_people", "house_people")
      .leftJoinAndSelect("house.house_address", "address")
      .leftJoinAndSelect("address.house_address_road", "road")
      .leftJoinAndSelect("person.person_house", "person_house")
      .leftJoinAndSelect("person_house.house_address", "person_house_address")
      .leftJoinAndSelect("person_house_address.house_address_road", "person_house_road")
      .leftJoinAndSelect("person.person_betrothal_receipts", "betrothal", "betrothal.accepted_at IS NULL AND betrothal.deleted_at IS NULL")
      .leftJoinAndSelect("betrothal.betrothal_proposer_person", "betrothal_person")
      .leftJoinAndSelect("betrothal.betrothal_dowry", "dowry")
      .leftJoinAndSelect("dowry.betrothal_dowry_person", "dowry_person")
      .leftJoinAndSelect("house.house_resources", "house_resources")
      .where("family.id = :id", { id: id })
    return await family.getOne();
  }
}
