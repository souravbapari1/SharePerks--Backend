import {
  IsString,
  IsNumber,
  IsDate,
  IsMongoId,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { CommissionType } from './createCoupon.dto';

export class UpdateCouponDto {
  @IsString()
  @IsOptional()
  aboutCoupon?: string;

  @IsMongoId()
  @IsOptional()
  brandId?: string;

  @IsOptional()
  clicks?: number;

  @IsString()
  @IsOptional()
  code?: number;

  @IsOptional()
  commissionRate?: number;

  @IsEnum(CommissionType)
  @IsOptional()
  commissionType: CommissionType;

  @IsOptional()
  expDate?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsOptional()
  couponImage?: string;

  @IsOptional()
  isEnable: string;

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
  couponKeyPoints?: string;

  @IsString()
  @IsOptional()
  couponTitle?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  stockISIN?: string;
}
