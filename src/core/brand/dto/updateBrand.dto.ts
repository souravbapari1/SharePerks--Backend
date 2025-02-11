import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { CommissionType } from 'src/core/offers/dto/createOffer.dto';

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

  @IsOptional()
  commissionRate?: number;

  @IsOptional()
  commissionRateWithHolding?: number;

  @IsEnum(CommissionType)
  @IsOptional()
  commissionType: CommissionType;
}
