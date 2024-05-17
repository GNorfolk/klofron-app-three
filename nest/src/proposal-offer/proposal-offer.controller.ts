import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProposalOfferService } from './proposal-offer.service';
import { CreateProposalOfferDto } from './dto/create-proposal-offer.dto';
import { UpdateProposalOfferDto } from './dto/update-proposal-offer.dto';

@Controller({
  path: 'proposal-offer',
  version: '2',
})
export class ProposalOfferController {
  constructor(private readonly proposalOfferService: ProposalOfferService) {}

  @Post()
  async create(@Body() createProposalOfferDto: CreateProposalOfferDto) {
    return await this.proposalOfferService.create(createProposalOfferDto);
  }

  @Get()
  async findAll() {
    return await this.proposalOfferService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.proposalOfferService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProposalOfferDto: UpdateProposalOfferDto) {
    return await this.proposalOfferService.update(+id, updateProposalOfferDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.proposalOfferService.remove(+id);
  }
}
