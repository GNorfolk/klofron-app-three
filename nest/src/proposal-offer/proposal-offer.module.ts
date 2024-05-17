import { Module } from '@nestjs/common';
import { ProposalOfferService } from './proposal-offer.service';
import { ProposalOfferController } from './proposal-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalOffer } from './entities/ProposalOffer';
import { ProposalDowry } from './entities/ProposalDowry';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalOffer, ProposalDowry])],
  controllers: [ProposalOfferController],
  providers: [ProposalOfferService],
})
export class ProposalOfferModule {}
