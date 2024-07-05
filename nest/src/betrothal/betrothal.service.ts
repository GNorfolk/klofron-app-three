import { Injectable } from '@nestjs/common';
import { CreateBetrothalDto } from './dto/create-betrothal.dto';
import { UpdateBetrothalDto } from './dto/update-betrothal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Betrothal } from './entities/Betrothal';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class BetrothalService {
  constructor(
    @InjectRepository(Betrothal) private betrothalRepository: Repository<Betrothal>,
    private dataSource: DataSource
  ) {}

  async create(createBetrothalDto: CreateBetrothalDto) {
    return 'This action adds a new betrothal';
  }

  async findAll(): Promise<Betrothal[]> {
    let betrothals = this.betrothalRepository
      .createQueryBuilder("betrothal")
    return await betrothals.getMany();
  }

  async findOne(id: number): Promise<Betrothal> {
    const betrothal = this.betrothalRepository
      .createQueryBuilder("betrothal")
      .where("betrothal.betrothal_id = :id", { id: id })
    return await betrothal.getOne();
  }

  async update(id: number, updateBetrothalDto: UpdateBetrothalDto) {
    return `This action updates a #${id} betrothal`;
  }

  async remove(id: number) {
    return `This action removes a #${id} betrothal`;
  }
}
