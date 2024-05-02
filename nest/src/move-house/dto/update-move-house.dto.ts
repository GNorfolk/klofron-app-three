import { PartialType } from '@nestjs/mapped-types';
import { CreateMoveHouseDto } from './create-move-house.dto';

export class UpdateMoveHouseDto extends PartialType(CreateMoveHouseDto) {}
