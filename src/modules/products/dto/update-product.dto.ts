import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  slug?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  name?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  description?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @IsOptional()
  price?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @IsNotEmpty()
  salePrice?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @IsOptional()
  stock?: number;
}
