import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProposalOfferDto } from './dto/create-proposal-offer.dto';
import { UpdateProposalOfferDto } from './dto/update-proposal-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProposalOffer } from './entities/ProposalOffer';

@Injectable()
export class ProposalOfferService {
  constructor(
    @InjectRepository(ProposalOffer) private proposalOfferRepository: Repository<ProposalOffer>,
    private dataSource: DataSource
  ) {}

  async create(proposalOffer: CreateProposalOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

  // async update(id: number, updateProposalOfferDto: UpdateProposalOfferDto) {
  //   return await`This action updates a #${id} proposalOffer`;
  // }

  // async remove(id: number) {
  //   return await`This action removes a #${id} proposalOffer`;
  // }
}
