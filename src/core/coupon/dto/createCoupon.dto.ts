import {
  IsString,
  IsDate,
  IsMongoId,
  IsOptional,
  IsEnum,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
export enum CommissionType {
  AMOUNT = 'AMOUNT',
  PERCENT = 'PERCENT',
}
export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  aboutCoupon: string;

  @IsMongoId()
  @IsNotEmpty()
  brandId: string;

  @IsOptional()
  clicks?: number;

  @IsString()
  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  commissionRate: number;

  @IsEnum(CommissionType)
  commissionType: CommissionType;

  @IsNotEmpty()
  expDate: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsOptional()
  couponImage?: string;

  @IsNotEmpty()
  isEnable: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  linkText: string;

  @IsString()
  category: string;

  @IsNotEmpty()
  couponKeyPoints: string;

  @IsString()
  couponTitle: string;

  @IsString()
  provider: string;

  @IsString()
  stockISIN: string;
}
