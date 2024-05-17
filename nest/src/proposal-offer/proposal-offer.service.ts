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

  create(createProposalOfferDto: CreateProposalOfferDto) {
    return 'This action adds a new proposalOffer';
  }

  findAll() {
    return `This action returns all proposalOffer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proposalOffer`;
  }

  update(id: number, updateProposalOfferDto: UpdateProposalOfferDto) {
    return `This action updates a #${id} proposalOffer`;
  }

  remove(id: number) {
    return `This action removes a #${id} proposalOffer`;
  }
}
