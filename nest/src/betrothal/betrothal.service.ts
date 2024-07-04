import { Injectable } from '@nestjs/common';
import { CreateBetrothalDto } from './dto/create-betrothal.dto';
import { UpdateBetrothalDto } from './dto/update-betrothal.dto';

@Injectable()
export class BetrothalService {
  async create(createBetrothalDto: CreateBetrothalDto) {
    return 'This action adds a new betrothal';
  }

  async findAll() {
    return [`This action returns all betrothal`];
  }

  async findOne(id: number) {
    return `This action returns a #${id} betrothal`;
  }

  async update(id: number, updateBetrothalDto: UpdateBetrothalDto) {
    return `This action updates a #${id} betrothal`;
  }

  async remove(id: number) {
    return `This action removes a #${id} betrothal`;
  }
}
