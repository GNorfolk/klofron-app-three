import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/Person';
import { PersonName } from './entities/PersonName';
import { PersonSkills } from './entities/PersonSkills';
import { PersonHaulage } from './entities/PersonHaulage';

@Module({
  imports: [TypeOrmModule.forFeature([Person, PersonName, PersonSkills, PersonHaulage])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
