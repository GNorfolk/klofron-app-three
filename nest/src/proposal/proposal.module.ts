import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/Proposal';
import { ProposalOffer } from './entities/ProposalOffer';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, ProposalOffer])],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
