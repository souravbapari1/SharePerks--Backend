import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CompleteUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  referCode?: string;
}
