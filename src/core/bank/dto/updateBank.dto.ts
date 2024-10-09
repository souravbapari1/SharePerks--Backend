import { IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateBankDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  user?: Types.ObjectId;

  @IsOptional()
  @IsString()
  ifscCode?: string;
}
