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
        .where("proposal.proposal_id = :id", { id: proposalOffer.proposal_offer_proposal_id })
        .getOne()
      const offerPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .where("person.person_id = :id", { id: proposalOffer.proposal_offer_person_id })
        .getOne()
      const dowryPerson = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .where("person.person_id = :id", { id: proposalDowry.proposal_dowry_person_id })
        .getOne()
      if (proposal.proposal_person.person_partner_id != null) throw "Proposal person already has partner id!"
      if (offerPerson.person_partner_id != null) throw "Offer person already has partner id!"
      if (dowryPerson.person_partner_id != null) throw "Dowry person already has partner id!"
      const dowry = await queryRunner.manager.save(ProposalDowry, proposalDowry);
      proposalOffer.proposal_offer_dowry_id = dowry.proposal_dowry_id
      result = await queryRunner.manager.save(ProposalOffer, proposalOffer);
      throw "shouldnt get this far"
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

  // async update(id: number, updateProposalOfferDto: UpdateProposalOfferDto) {
  //   return await`This action updates a #${id} proposalOffer`;
  // }

  // async remove(id: number) {
  //   return await`This action removes a #${id} proposalOffer`;
  // }
}
