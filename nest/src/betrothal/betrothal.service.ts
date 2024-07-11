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
      if (compareAncestorIdsBoolean) throw "Proposer person and / or dowry person share ancestors with recipient person!"
      if (recipientPerson.person_partner_id != null) throw "recipient person already has partner id!"
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

  // async update(id: number, updateBetrothalDto: UpdateBetrothalDto) {
  //   return `This action updates a #${id} betrothal`;
  // }

  async update(betrothalId: number, accepterPersonId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const selected = await queryRunner.manager
        .createQueryBuilder(Betrothal, "betrothal")
        .leftJoinAndSelect("betrothal.betrothal_dowry", "dowry")
        .where("betrothal.betrothal_id = :id", { id: betrothalId })
        .getOne()
      const people = await Promise.all([
        queryRunner.manager // recipientPerson to go to proposer person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.betrothal_recipient_person_id })
          .getOne(),
        queryRunner.manager // proposerPerson to take recipient person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.betrothal_proposer_person_id })
          .getOne(),
        queryRunner.manager // dowryPerson to go to accepter person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.betrothal_dowry.betrothal_dowry_person_id })
          .getOne(),
        queryRunner.manager // accepterPerson take dowry person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: accepterPersonId })
          .getOne()
      ])
      const recipientPerson = people[0]
      const proposerPerson = people[1]
      const dowryPerson = people[2]
      const accepterPerson = people[3]
      const recipientPersonArray = [], proposerPersonArray = [], dowryPersonArray = [], accepterPersonArray = []
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
      accepterPersonArray.push(
        accepterPerson.person_id,
        accepterPerson.person_mother.person_id,
        accepterPerson.person_father.person_id,
        accepterPerson.person_mother.person_mother.person_id,
        accepterPerson.person_mother.person_father.person_id,
        accepterPerson.person_father.person_mother.person_id,
        accepterPerson.person_father.person_father.person_id
      )
      const recipientPersonArrayFiltered = recipientPersonArray.filter((item) => item != 1 && item != 2);
      const proposerPersonArrayFiltered = proposerPersonArray.filter((item) => item != 1 && item != 2);
      const dowryPersonArrayFiltered = dowryPersonArray.filter((item) => item != 1 && item != 2);
      const accepterPersonArrayFiltered = accepterPersonArray.filter((item) => item != 1 && item != 2);
      const compareAncestorIdsBooleanOne = recipientPersonArrayFiltered.some(r=> proposerPersonArrayFiltered.includes(r))
      const compareAncestorIdsBooleanTwo = accepterPersonArrayFiltered.some(r=> dowryPersonArrayFiltered.includes(r))
      if (compareAncestorIdsBooleanOne) throw "Proposer person shares ancestors with recipient person!"
      if (compareAncestorIdsBooleanTwo) throw "Dowry person shares ancestors with accepter person!"
      const proposerPersonUpdate = await queryRunner.manager.update(Person, proposerPerson.person_id, {
        person_partner_id: recipientPerson.person_id,
      })
      const recipientPersonUpdate = await queryRunner.manager.update(Person, recipientPerson.person_id , {
        person_house_id: proposerPerson.person_house_id,
        person_partner_id: proposerPerson.person_id,
        person_family_id: proposerPerson.person_family_id
      })
      if (proposerPersonUpdate.affected != 1) throw "Unable to update proposer person!";
      if (recipientPersonUpdate.affected != 1) throw "Unable to update recipient person!";

      const dowryPersonUpdate = await queryRunner.manager.update(Person, dowryPerson.person_id, {
        person_house_id: accepterPerson.person_house_id,
        person_partner_id: accepterPerson.person_id,
        person_family_id: accepterPerson.person_family_id
      })
      const accepterPersonUpdate = await queryRunner.manager.update(Person, accepterPerson.person_id , {
        person_partner_id: dowryPerson.person_id,
      })
      if (dowryPersonUpdate.affected != 1) throw "Unable to update dowry person!";
      if (accepterPersonUpdate.affected != 1) throw "Unable to update accepter person!";
      // Accept betrothal and dowry and throw error if we can't
      const betrothalAcceptedAt = await queryRunner.manager.update(Betrothal, selected.betrothal_id, { betrothal_accepted_at: new Date() })
      if (betrothalAcceptedAt.affected != 1) throw "Unable to update betrothal accepted_at field!"
      const betrothalDowryAcceptedAt = await queryRunner.manager.update(BetrothalDowry, selected.betrothal_dowry_id, { betrothal_dowry_accepted_at: new Date() })
      if (betrothalDowryAcceptedAt.affected != 1) throw "Unable to update dowry accepted_at field!"
      // Cancel unsuccessful betrothals to person and throw if we can't
      // ToDo: Check that this doesn't cancel the proposal offer we've just accepted
      const betrothalsCancelledAt = await queryRunner.manager.update(
        Betrothal,
        { betrothal_recipient_person_id: selected.betrothal_recipient_person_id },
        { betrothal_deleted_at: new Date() }
      )
      if (betrothalsCancelledAt.affected == 0) throw "Unable to update betrothal cancelled_at field!"
      // Cancel unsuccessful betrothal dowrys on betrothals to recipient and throw if we get unexpected number of affected rows
      const unsuccessfulBetrothalArray = selected.betrothal_recipient_person.person_betrothal_receipts.filter(betrothals => betrothals.betrothal_id != betrothalId)
      for (let i = 0; i < unsuccessfulBetrothalArray.length; i++) {
        const proposalDowrysCancelledAt = await queryRunner.manager.update(
          BetrothalDowry,
          { betrothal_dowry_id: unsuccessfulBetrothalArray[i].betrothal_dowry_id },
          { betrothal_dowry_deleted_at: new Date() }
        )
        if (proposalDowrysCancelledAt.affected != 1) throw "Unable to update dowry cancelled_at field!"
      }
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

  async remove(id: number) {
    return `This action removes a #${id} betrothal`;
  }
}
