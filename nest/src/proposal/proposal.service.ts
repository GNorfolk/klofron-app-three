import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Proposal } from './entities/Proposal';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Person } from '../person/entities/Person';

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
      const person = await queryRunner.manager
        .createQueryBuilder(Person, "person")
        .leftJoinAndSelect("person.person_proposals", "proposal", "proposal.cancelled_at IS NULL AND proposal.accepted_at IS NULL")
        .where("person.person_id = :id", { id: proposal.proposal_person_id })
        .getOne();
      if (person.person_partner_id != null) throw "Person already has a non-null partner id!"
      if (person.person_age < 18) throw "Person is under the age of 18!"
      if (person.person_proposals.length > 0) throw "Person already has an open proposal!"
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
      .leftJoinAndSelect("proposal.proposal_offers", "offer", "offer.accepted_at IS NULL AND offer.deleted_at IS NULL")
      .leftJoinAndSelect("offer.proposal_offer_person", "offer_person")
      .leftJoinAndSelect("offer.proposal_offer_dowry", "dowry")
      .leftJoinAndSelect("dowry.proposal_dowry_person", "dowry_person")
      .innerJoinAndSelect("person.person_family","family")
      .innerJoinAndSelect("family.family_people","people")
      .where("proposal.proposal_id = :id", { id: id })
    return await proposal.getOne();
  }
}
