import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal } from './entities/Proposal';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal) private proposalRepository: Repository<Proposal>,
  ) {}

  async findAll(): Promise<Proposal[]> {
    let proposals = this.proposalRepository
      .createQueryBuilder("proposal")
      .innerJoinAndSelect("proposal.proposal_person","proposer")
      .innerJoinAndSelect("proposer.person_family","family")
      .where("proposal.accepted_at IS NULL AND proposal.cancelled_at IS NULL")
    return await proposals.getMany();
  }

  async findOne(id: number): Promise<Proposal> {
    const proposal = this.proposalRepository
      .createQueryBuilder("proposal")
      .where("proposal.proposal_id = :id", { id: id })
    return await proposal.getOne();
  }
}
