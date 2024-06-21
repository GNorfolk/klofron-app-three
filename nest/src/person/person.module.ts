import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/Person';
import { PersonName } from './entities/PersonName';
import { PersonSkills } from './entities/PersonSkills';

@Module({
  imports: [TypeOrmModule.forFeature([Person, PersonName, PersonSkills])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
