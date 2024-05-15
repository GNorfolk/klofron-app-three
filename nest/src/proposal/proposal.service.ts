import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalEligible } from './entities/ProposalEligible';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(ProposalEligible) private proposalRepository: Repository<ProposalEligible>,
  ) {}

  async findAll(): Promise<ProposalEligible[]> {
    let proposals = this.proposalRepository
      .createQueryBuilder("proposal")
      .innerJoinAndSelect("proposal.proposal_person","person")
      .innerJoinAndSelect("person.person_family","family")
      .where("proposal.accepted_at IS NULL AND proposal.cancelled_at IS NULL")
    return await proposals.getMany();
  }

  async findOne(id: number): Promise<ProposalEligible> {
    const proposal = this.proposalRepository
      .createQueryBuilder("proposal")
      .innerJoinAndSelect("proposal.proposal_person","person")
      .where("proposal.proposal_id = :id", { id: id })
    return await proposal.getOne();
  }
}
