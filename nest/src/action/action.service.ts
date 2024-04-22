import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/Action';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action) private actionRepository: Repository<Action>,
  ) {}

  create(createActionDto: CreateActionDto) {
    return 'This action adds a new action';
  }

  async findAll(query): Promise<Action[]> {
    let actions =  this.actionRepository
      .createQueryBuilder("action")
      .orderBy("action.started_at", "DESC")
    if (query?.limit) {
      actions = actions.limit(query.limit)
    }
    if (query?.person_id) {
      actions = actions.where("action.person_id = :id", { id: query.person_id })
      if (query?.current && query.current == "true") {
        actions = actions.andWhere("action.completed_at IS NULL AND action.cancelled_at IS NULL");
      } else if (query?.current && query.current == "false") {
        actions = actions.andWhere("(action.completed_at IS NOT NULL OR action.cancelled_at IS NOT NULL)");
      }
    }
    return await actions.getMany();
  }

  async findOne(id: number): Promise<Action> {
    return await this.actionRepository.findOne({
      where: {
        action_id: id,
      },
    });
  }
}
