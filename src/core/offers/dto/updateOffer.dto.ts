import {
  IsString,
  IsNumber,
  IsDate,
  IsMongoId,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { CommissionType } from './createOffer.dto';

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  aboutOffer?: string;

  @IsMongoId()
  @IsOptional()
  brandId?: string;

  @IsOptional()
  clicks?: number;

  @IsOptional()
  commissionRate?: number;

  @IsEnum(CommissionType)
  @IsOptional()
  commissionType: CommissionType;

  @IsOptional()
  expDate?: string;

  @IsOptional()
  bannerImage?: string;

  @IsOptional()
  offerImage?: string;

  @IsOptional()
  isEnable?: string;

  @IsOptional()
  isInSlide?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  linkText?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  offerKeyPoints?: string;

  @IsString()
  @IsOptional()
  offerTitle?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  stockISIN?: string;
}
