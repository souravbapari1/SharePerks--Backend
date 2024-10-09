import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePayoutDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(['pending', 'complete', 'failed', 'cancel'])
  @IsOptional()
  status: 'pending' | 'complete' | 'failed' | 'cancel';

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  user: Types.ObjectId;

  @IsNotEmpty()
  bank: any;
}
