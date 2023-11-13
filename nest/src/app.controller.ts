import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/list-people')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(): object {
    return this.appService.getData();
  }
}
