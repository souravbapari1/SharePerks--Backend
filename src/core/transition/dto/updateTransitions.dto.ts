import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTransitionsDto {
  @IsString()
  @IsOptional()
  transitions_id?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  completePayment?: boolean;

  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  typeDocId?: string;

  @IsOptional()
  data?: any;
}

export class ReferRewardDto {
  @IsNumber()
  @IsOptional()
  refererAmount?: number;

  @IsNumber()
  @IsOptional()
  referralAmount?: number;
}
