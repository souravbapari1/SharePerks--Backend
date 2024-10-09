import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  btnText?: string;

  @IsString()
  @IsOptional()
  linkUrl?: string;

  @IsOptional()
  category?: any;

  @IsNumber()
  @IsOptional()
  clicks?: number;

  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  stockISIN?: string;

  @IsOptional()
  offerTerms?: any;

  @IsOptional()
  cashBackRates?: any;

  @IsString()
  @IsOptional()
  aboutBrand?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  brandImage?: string;

  @IsString()
  @IsOptional()
  discountHighLights?: string;
}
