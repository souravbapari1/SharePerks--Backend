import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsString()
  btnText: string;

  @IsString()
  linkUrl: string;

  @IsNotEmpty()
  category: any;

  @IsNumber()
  @IsOptional()
  clicks?: number;

  @IsOptional()
  isActive?: string;

  @IsString()
  provider: string;

  @IsString()
  stockISIN: string;

  @IsNotEmpty()
  offerTerms: any;

  @IsNotEmpty()
  cashBackRates: any;

  @IsString()
  @IsNotEmpty()
  aboutBrand: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  brandImage?: string;

  @IsString()
  @IsNotEmpty()
  discountHighLights: string;
}
