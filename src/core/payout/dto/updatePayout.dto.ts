import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdatePayoutDto {
  @IsOptional()
  amount?: number;

  @IsEnum(['pending', 'complete', 'failed', 'cancel'])
  @IsOptional()
  status?: 'pending' | 'complete' | 'failed' | 'cancel';

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  user?: Types.ObjectId;

  @IsOptional()
  bank?: any;

  @IsOptional()
  upi?: any;
}
