import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  referCode?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  mobile?: number;

  @IsOptional()
  @IsNumber()
  walletAmount?: number;

  @IsOptional()
  @IsBoolean()
  completeProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  brokerConnected?: boolean;

  @IsOptional()
  @IsString()
  role?: string;
}
