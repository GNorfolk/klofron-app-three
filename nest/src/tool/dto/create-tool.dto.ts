import { IsEnum, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ToolHandle, ToolMaterial, ToolType } from '../entities/Tool';
import { Exclude } from 'class-transformer';
export class CreateToolDto {
  @IsEnum(ToolMaterial)
  @IsNotEmpty()
  material: ToolMaterial;

  @IsEnum(ToolHandle)
  @IsOptional()
  handle?: ToolHandle;

  @IsEnum(ToolType)
  @IsNotEmpty()
  type: ToolType;

  @Exclude()
  durability?: number
}
