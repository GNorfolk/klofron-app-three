import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/Resource';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource) private resourceRepository: Repository<Resource>,
  ) {}

  async findAll(): Promise<Resource[]> {
    return await this.resourceRepository.find();
  }

  async findByHouseId(house_id: number) {
    return await this.resourceRepository.find({
      where: {
        resource_house_id: house_id,
      },
    });
  }
}
