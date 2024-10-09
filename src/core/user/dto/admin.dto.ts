import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class AdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  newpassword?: string;
}
