import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { CommissionType } from 'src/core/offers/dto/createOffer.dto';

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
  commissionRate: number;

  @IsString()
  commissionRateWithHolding: number;

  @IsEnum(CommissionType)
  commissionType: CommissionType;
}
