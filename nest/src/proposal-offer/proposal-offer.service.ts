import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProposalOfferDto } from './dto/create-proposal-offer.dto';
import { UpdateProposalOfferDto } from './dto/update-proposal-offer.dto';
import { CreateProposalDowryDto } from './dto/create-proposal-dowry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProposalOffer } from './entities/ProposalOffer';
import { ProposalDowry } from './entities/ProposalDowry';
import { Person } from '../person/entities/Person';
import { Proposal } from '../proposal/entities/Proposal';

@Injectable()
export class ProposalOfferService {
  constructor(
    @InjectRepository(ProposalOffer) private proposalOfferRepository: Repository<ProposalOffer>,
    @InjectRepository(ProposalDowry) private proposalDowryRepository: Repository<ProposalDowry>,
    private dataSource: DataSource
  ) {}

  async create(proposalOffer: CreateProposalOfferDto, proposalDowry: CreateProposalDowryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await queryRunner.manager
        .createQueryBuilder(ProposalOffer, "offer")
        .leftJoinAndSelect("offer.proposal_offer_dowry", "dowry")
        .where("offer.proposal_offer_proposal_id = :id", { id: proposalOffer.proposal_offer_proposal_id })
        .andWhere("offer.proposal_offer_person_id = :idd", { idd: proposalOffer.proposal_offer_person_id })
        .andWhere("dowry.proposal_dowry_person_id = :iddd", { iddd: proposalDowry.proposal_dowry_person_id })
        .getMany()
      if (existing.length > 0) throw "This proposal offer already exists!"
      const proposal = await queryRunner.manager
        .createQueryBuilder(Proposal, "proposal")
        .innerJoinAndSelect("proposal.proposal_person", "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("proposal.proposal_id = :id", { id: proposalOffer.proposal_offer_proposal_id })
        .getOne()
      const offerPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("person.person_id = :id", { id: proposalOffer.proposal_offer_person_id })
        .getOne()
      const dowryPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .innerJoinAndSelect("person.person_mother", "mother")
        .innerJoinAndSelect("person.person_father", "father")
        .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
        .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
        .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
        .innerJoinAndSelect("father.person_father", "paternal_grandfather")
        .where("person.person_id = :id", { id: proposalDowry.proposal_dowry_person_id })
        .getOne()
      const proposalPersonArray = [], offerPersonArray = [], dowryPersonArray = []
      proposalPersonArray.push(
        proposal.proposal_person.person_id,
        proposal.proposal_person.person_mother.person_id,
        proposal.proposal_person.person_father.person_id,
        proposal.proposal_person.person_mother.person_mother.person_id,
        proposal.proposal_person.person_mother.person_father.person_id,
        proposal.proposal_person.person_father.person_mother.person_id,
        proposal.proposal_person.person_father.person_father.person_id
      )
      offerPersonArray.push(
        offerPerson.person_id,
        offerPerson.person_mother.person_id,
        offerPerson.person_father.person_id,
        offerPerson.person_mother.person_mother.person_id,
        offerPerson.person_mother.person_father.person_id,
        offerPerson.person_father.person_mother.person_id,
        offerPerson.person_father.person_father.person_id
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
      const proposalPersonArrayFiltered = proposalPersonArray.filter((item) => item != 1 && item != 2);
      const offerPersonArrayFiltered = offerPersonArray.filter((item) => item != 1 && item != 2);
      const dowryPersonArrayFiltered = dowryPersonArray.filter((item) => item != 1 && item != 2);
      const compareAncestorIdsBoolean = proposalPersonArrayFiltered.some(r=> offerPersonArrayFiltered.concat(dowryPersonArrayFiltered).includes(r))
      if (compareAncestorIdsBoolean) throw "Offer person and / or dowry person share ancestors with proposal person!"
      if (proposal.proposal_person.person_partner_id != null) throw "Proposal person already has partner id!"
      if (offerPerson.person_partner_id != null) throw "Offer person already has partner id!"
      if (dowryPerson.person_partner_id != null) throw "Dowry person already has partner id!"
      const dowry = await queryRunner.manager.save(ProposalDowry, proposalDowry);
      proposalOffer.proposal_offer_dowry_id = dowry.proposal_dowry_id
      result = await queryRunner.manager.save(ProposalOffer, proposalOffer);
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

  async findAll(): Promise<ProposalOffer[]> {
    let proposalOffers = this.proposalOfferRepository
      .createQueryBuilder("proposalOffer")
    return await proposalOffers.getMany();
  }

  async findOne(id: number): Promise<ProposalOffer> {
    const proposalOffer = this.proposalOfferRepository
      .createQueryBuilder("proposalOffer")
      .where("proposalOffer.proposal_offer_id = :id", { id: id })
    return await proposalOffer.getOne();
  }

  async update(proposalOfferId: number, accepterPersonId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const selected = await queryRunner.manager
        .createQueryBuilder(ProposalOffer, "offer")
        .innerJoinAndSelect("offer.proposal_offer_proposal", "proposal")
        .leftJoinAndSelect("offer.proposal_offer_dowry", "dowry")
        .where("offer.proposal_offer_id = :id", { id: proposalOfferId })
        .getOne()
      const people = await Promise.all([
        queryRunner.manager // proposalPerson to go to offer person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.proposal_offer_proposal.proposal_person_id })
          .getOne(),
        queryRunner.manager // offerPerson to take proposal person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.proposal_offer_person_id })
          .getOne(),
        queryRunner.manager // dowryPerson to go to accepter person
          .createQueryBuilder(Person, "person")
          .innerJoinAndSelect("person.person_mother", "mother")
          .innerJoinAndSelect("person.person_father", "father")
          .innerJoinAndSelect("mother.person_mother", "maternal_grandmother")
          .innerJoinAndSelect("mother.person_father", "maternal_grandfather")
          .innerJoinAndSelect("father.person_mother", "paternal_grandmother")
          .innerJoinAndSelect("father.person_father", "paternal_grandfather")
          .where("person.person_id = :id", { id: selected.proposal_offer_dowry.proposal_dowry_person_id })
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
      const proposalPerson = people[0]
      const offerPerson = people[1]
      const dowryPerson = people[2]
      const accepterPerson = people[3]
      const proposalPersonArray = [], offerPersonArray = [], dowryPersonArray = [], accepterPersonArray = []
      proposalPersonArray.push(
        proposalPerson.person_id,
        proposalPerson.person_mother.person_id,
        proposalPerson.person_father.person_id,
        proposalPerson.person_mother.person_mother.person_id,
        proposalPerson.person_mother.person_father.person_id,
        proposalPerson.person_father.person_mother.person_id,
        proposalPerson.person_father.person_father.person_id
      )
      offerPersonArray.push(
        offerPerson.person_id,
        offerPerson.person_mother.person_id,
        offerPerson.person_father.person_id,
        offerPerson.person_mother.person_mother.person_id,
        offerPerson.person_mother.person_father.person_id,
        offerPerson.person_father.person_mother.person_id,
        offerPerson.person_father.person_father.person_id
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
      const proposalPersonArrayFiltered = proposalPersonArray.filter((item) => item != 1 && item != 2);
      const offerPersonArrayFiltered = offerPersonArray.filter((item) => item != 1 && item != 2);
      const dowryPersonArrayFiltered = dowryPersonArray.filter((item) => item != 1 && item != 2);
      const accepterPersonArrayFiltered = accepterPersonArray.filter((item) => item != 1 && item != 2);
      const compareAncestorIdsBooleanOne = proposalPersonArrayFiltered.some(r=> offerPersonArrayFiltered.includes(r))
      const compareAncestorIdsBooleanTwo = accepterPersonArrayFiltered.some(r=> dowryPersonArrayFiltered.includes(r))
      if (compareAncestorIdsBooleanOne) throw "Offer person share ancestors with proposal person!"
      if (compareAncestorIdsBooleanTwo) throw "Dowry person share ancestors with accepter person!"
      const offerPersonUpdate = await queryRunner.manager.update(Person, offerPerson.person_id, {
        person_partner_id: proposalPerson.person_id,
      })
      const proposalPersonUpdate = await queryRunner.manager.update(Person, proposalPerson.person_id , {
        person_house_id: offerPerson.person_house_id,
        person_partner_id: offerPerson.person_id,
        person_family_id: offerPerson.person_family_id
      })
      if (offerPersonUpdate.affected != 1) throw "Unable to update offer person!";
      if (proposalPersonUpdate.affected != 1) throw "Unable to update proposal person!";

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
      await queryRunner.manager.update(ProposalOffer, selected.proposal_offer_id, { proposal_offer_accepted_at: "CURRENT_TIMESTAMP" })
      await queryRunner.manager.update(ProposalDowry, selected.proposal_offer_dowry_id, { proposal_dowry_accepted_at: "CURRENT_TIMESTAMP" })
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

  // async remove(id: number) {
  //   return await`This action removes a #${id} proposalOffer`;
  // }
}
