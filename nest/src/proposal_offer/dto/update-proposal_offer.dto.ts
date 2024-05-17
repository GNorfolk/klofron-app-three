import { PartialType } from '@nestjs/mapped-types';
import { CreateProposalOfferDto } from './create-proposal_offer.dto';

export class UpdateProposalOfferDto extends PartialType(CreateProposalOfferDto) {}
