import { Injectable } from '@nestjs/common';

@Injectable()
export class FamilyService {
  findAll() {
    return `This action returns all family`;
  }

  findOne(id: number) {
    return `This action returns a #${id} family`;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
