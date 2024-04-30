import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/Resource';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource) private resourceRepository: Repository<Resource>,
    private dataSource: DataSource
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

  async updateMoveResource(body) {
    const queryRunner = this.dataSource.createQueryRunner();
    let res = []
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      res.push(await queryRunner.manager.increment(Resource, {
        resource_type_name: body.resource_type,
        resource_person_id: body.person_id
      }, "resource_volume", body.resource_volume))
      res.push(await queryRunner.manager.decrement(Resource, {
        resource_type_name: body.resource_type,
        resource_house_id: body.house_id
      }, "resource_volume", body.resource_volume))
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return res;
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException();
    }
  }

}
