import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OfflineStoreAddressDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  shop_contact?: string;
}

export class CreateGiftCardDto {
  @IsNotEmpty()
  @IsString()
  storeType: string;

  @IsNotEmpty()
  @IsString()
  codeType: string;

  @IsNotEmpty()
  @IsString()
  brandId: string;

  @IsNotEmpty()
  denominationList: any;

  @IsNotEmpty()
  isEnable: any;

  @IsNotEmpty()
  @IsString()
  stockISIN: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  taq?: string;

  @IsOptional()
  @IsString()
  redeemSteps: string;

  @IsOptional()
  GiftCardImage: any;

  @IsOptional()
  @IsString()
  OnlineRedemptionUrl: string;

  @IsOptional()
  data?: Record<string, any>;

  @IsNotEmpty()
  inStockPercent: number;

  @IsNotEmpty()
  withoutStockPercent: number;

  @IsOptional()
  offlineStoreAddress?: OfflineStoreAddressDto;
}

export class UpdateGiftCardDto {
  @IsOptional()
  @IsString()
  storeType?: string;

  @IsOptional()
  @IsString()
  codeType?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  denominationList?: any;

  @IsOptional()
  isEnable?: any;

  @IsOptional()
  @IsString()
  stockISIN?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  taq?: string;

  @IsOptional()
  @IsString()
  redeemSteps?: string;

  @IsOptional()
  GiftCardImage?: string;

  @IsOptional()
  @IsString()
  OnlineRedemptionUrl?: string;

  @IsOptional()
  data?: Record<string, any>;

  @IsOptional()
  inStockPercent?: any;

  @IsOptional()
  withoutStockPercent?: any;

  @IsOptional()
  offlineStoreAddress?: OfflineStoreAddressDto;
}
