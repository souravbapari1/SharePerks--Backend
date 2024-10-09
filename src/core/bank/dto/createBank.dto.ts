import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsOptional()
  user?: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  ifscCode: string;
}
