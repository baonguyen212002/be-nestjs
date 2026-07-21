import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  title!: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  slug!: string;
}
