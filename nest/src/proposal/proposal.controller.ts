import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { Proposal } from './entities/Proposal';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Controller({
  path: 'proposal',
  version: '2',
})
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  async findAll(): Promise<Proposal[]> {
    return this.proposalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Proposal> {
    return await this.proposalService.findOne(+id);
  }

  @Post()
  async create(@Body() proposal: CreateProposalDto) {
    return await this.proposalService.create(proposal);
  }
}
