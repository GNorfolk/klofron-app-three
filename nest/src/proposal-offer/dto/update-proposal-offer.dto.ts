import { PartialType } from '@nestjs/mapped-types';
import { CreateProposalOfferDto } from './create-proposal-offer.dto';

export class UpdateProposalOfferDto extends PartialType(CreateProposalOfferDto) {
    proposal_offer_id: number
}
