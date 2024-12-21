import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWhoowDto {
  @IsNotEmpty()
  @IsString()
  brandId: string; // Assuming ObjectId as a string

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  taq: string; // Assuming ObjectId as a string

  @IsNotEmpty()
  @Type(() => Object)
  pricing: any; // Adjust based on specific structure, if possible

  @IsOptional()
  isEnable: boolean = false;

  @IsNotEmpty()
  @IsString()
  stockISIN: string;

  @IsOptional()
  GiftCardImage: string;

  @IsNotEmpty()
  data: any; // Adjust based on specific structure, if possible
}
