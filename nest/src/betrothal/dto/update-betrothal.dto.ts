import { PartialType } from '@nestjs/mapped-types';
import { CreateBetrothalDto } from './create-betrothal.dto';

export class UpdateBetrothalDto extends PartialType(CreateBetrothalDto) {}
