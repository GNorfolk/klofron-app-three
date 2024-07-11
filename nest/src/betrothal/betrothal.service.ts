import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBetrothalDto } from './dto/create-betrothal.dto';
import { CreateBetrothalDowryDto } from './dto/create-betrothal-dowry.dto';
import { UpdateBetrothalDto } from './dto/update-betrothal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Betrothal } from './entities/Betrothal';
import { BetrothalDowry } from './entities/BetrothalDowry';
import { Repository, DataSource } from 'typeorm';
import { Person } from '../person/entities/Person';

@Injectable()
export class BetrothalService {
  constructor(
    @InjectRepository(Betrothal) private betrothalRepository: Repository<Betrothal>,
    private dataSource: DataSource
  ) {}

  async create(betrothal: CreateBetrothalDto, betrothalDowry: CreateBetrothalDowryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await queryRunner.manager
        .createQueryBuilder(Betrothal, "betrothal")
        .leftJoinAndSelect("betrothal.betrothal_dowry", "dowry")
        .where("betrothal.betrothal_recipient_person_id = :idd", { idd: betrothal.betrothal_recipient_person_id })
        .andWhere("betrothal.betrothal_proposer_person_id = :id", { id: betrothal.betrothal_proposer_person_id })
        .andWhere("dowry.betrothal_dowry_person_id = :iddd", { iddd: betrothalDowry.betrothal_dowry_person_id })
        .getMany()
      if (existing.length > 0) throw "This betrothal already exists!"
      const recipientPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("person.person_id = :id", { id: betrothal.betrothal_recipient_person_id })
        .getOne()
      const proposerPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("person.person_id = :id", { id: betrothal.betrothal_proposer_person_id })
        .getOne()
      const dowryPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("person.person_id = :id", { id: betrothalDowry.betrothal_dowry_person_id })
        .getOne()
      const recipientPersonArray = [], proposerPersonArray = [], dowryPersonArray = []
      recipientPersonArray.push(
        recipientPerson.person_id,
        recipientPerson.person_mother.person_id,
        recipientPerson.person_father.person_id,
        recipientPerson.person_mother.person_mother.person_id,
        recipientPerson.person_mother.person_father.person_id,
        recipientPerson.person_father.person_mother.person_id,
        recipientPerson.person_father.person_father.person_id
      )
      proposerPersonArray.push(
        proposerPerson.person_id,
        proposerPerson.person_mother.person_id,
        proposerPerson.person_father.person_id,
        proposerPerson.person_mother.person_mother.person_id,
        proposerPerson.person_mother.person_father.person_id,
        proposerPerson.person_father.person_mother.person_id,
        proposerPerson.person_father.person_father.person_id
      )
      dowryPersonArray.push(
        dowryPerson.person_id,
        dowryPerson.person_mother.person_id,
        dowryPerson.person_father.person_id,
        dowryPerson.person_mother.person_mother.person_id,
        dowryPerson.person_mother.person_father.person_id,
        dowryPerson.person_father.person_mother.person_id,
        dowryPerson.person_father.person_father.person_id
      )
      const recipientPersonArrayFiltered = recipientPersonArray.filter((item) => item != 1 && item != 2);
      const proposerPersonArrayFiltered = proposerPersonArray.filter((item) => item != 1 && item != 2);
      const dowryPersonArrayFiltered = dowryPersonArray.filter((item) => item != 1 && item != 2);
      const compareAncestorIdsBoolean = recipientPersonArrayFiltered.some(r=> proposerPersonArrayFiltered.concat(dowryPersonArrayFiltered).includes(r))
      if (compareAncestorIdsBoolean) throw "Proposer person and / or dowry person share ancestors with proposal person!"
      if (recipientPerson.person_partner_id != null) throw "Proposal person already has partner id!"
      if (proposerPerson.person_partner_id != null) throw "Proposer person already has partner id!"
      if (dowryPerson.person_partner_id != null) throw "Dowry person already has partner id!"
      const dowry = await queryRunner.manager.save(BetrothalDowry, betrothalDowry);
      betrothal.betrothal_dowry_id = dowry.betrothal_dowry_id
      result = await queryRunner.manager.save(Betrothal, betrothal);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
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
