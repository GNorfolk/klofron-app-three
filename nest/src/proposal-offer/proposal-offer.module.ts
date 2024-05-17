import { Module } from '@nestjs/common';
import { ProposalOfferService } from './proposal-offer.service';
import { ProposalOfferController } from './proposal-offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalOffer } from './entities/ProposalOffer';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalOffer])],
  controllers: [ProposalOfferController],
  providers: [ProposalOfferService],
})
export class ProposalOfferModule {}
