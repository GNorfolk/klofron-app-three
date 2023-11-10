import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): object {
    return {
      success: true,
      data: []
    };
  }
}
