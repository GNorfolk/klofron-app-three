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
    let family = this.familyRepository
      .createQueryBuilder("family")
      .leftJoinAndSelect("family.family_people", "person", "person.deleted_at IS NULL")
      .leftJoinAndSelect("family.family_houses", "house")
      .leftJoinAndSelect("person.person_house", "person_house")
      .leftJoinAndSelect("person_house.house_address", "address")
      .leftJoinAndSelect("address.house_address_road", "road")
      .leftJoinAndSelect("person.person_proposals", "proposal", "proposal.accepted_at IS NULL AND proposal.cancelled_at IS NULL")
      .leftJoinAndSelect("proposal.proposal_offers", "offer", "offer.accepted_at IS NULL AND offer.deleted_at IS NULL")
      .leftJoinAndSelect("offer.proposal_offer_person", "offer_person")
      .leftJoinAndSelect("offer.proposal_offer_dowry", "dowry")
      .leftJoinAndSelect("dowry.proposal_dowry_person", "dowry_person")
      .leftJoinAndSelect("house.house_food", "house_food", "house_food.type_name = 'food'")
      .leftJoinAndSelect("house.house_wood", "house_wood", "house_wood.type_name = 'wood'")
      .where("family.id = :id", { id: id })
    return await family.getOne();
  }
}
