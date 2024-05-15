import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEligible } from './entities/ProposalEligible';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalEligible])],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
