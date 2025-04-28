import { Injectable } from '@nestjs/common';

@Injectable()
export class HexService {
  findAll() {
    return `This action returns all hex`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hex`;
  }
}
