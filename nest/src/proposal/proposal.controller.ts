import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalEligible } from './entities/ProposalEligible';

@Controller({
  path: 'proposal',
  version: '2',
})
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  async findAll(): Promise<ProposalEligible[]> {
    return this.proposalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProposalEligible> {
    return await this.proposalService.findOne(+id);
  }
}
