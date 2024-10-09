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
export class CreateOfferDto {
  @IsString()
  aboutOffer: string;

  @IsMongoId()
  brandId: string;

  @IsOptional()
  clicks: number;

  @IsString()
  commissionRate: number;

  @IsEnum(CommissionType)
  commissionType: CommissionType;

  @IsNotEmpty()
  expDate: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  offerImage?: string;

  @IsNotEmpty()
  isEnable: string;

  @IsNotEmpty()
  isInSlide: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  linkText: string;

  @IsString()
  category: string;

  @IsNotEmpty()
  offerKeyPoints: string;

  @IsString()
  offerTitle: string;

  @IsString()
  provider: string;

  @IsString()
  stockISIN: string;
}
