import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/Person';
import { PersonName } from './entities/PersonName';

@Module({
  imports: [TypeOrmModule.forFeature([Person, PersonName])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
