import { IsOptional, IsString, IsEmail } from 'class-validator';

export class AdminUserDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  role?: string;
}
