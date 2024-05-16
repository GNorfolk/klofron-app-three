import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Proposal } from './entities/Proposal';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal) private proposalRepository: Repository<Proposal>,
    private dataSource: DataSource
  ) {}

  async create(proposal: CreateProposalDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      result = await queryRunner.manager.save(Proposal, proposal);
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

  async findAll(): Promise<Proposal[]> {
    let proposals = this.proposalRepository
      .createQueryBuilder("proposal")
      .innerJoinAndSelect("proposal.proposal_person","person")
      .innerJoinAndSelect("person.person_family","family")
      .where("proposal.accepted_at IS NULL AND proposal.cancelled_at IS NULL")
    return await proposals.getMany();
  }

  async findOne(id: number): Promise<Proposal> {
    const proposal = this.proposalRepository
      .createQueryBuilder("proposal")
      .innerJoinAndSelect("proposal.proposal_person","person")
      .where("proposal.proposal_id = :id", { id: id })
    return await proposal.getOne();
  }
}
