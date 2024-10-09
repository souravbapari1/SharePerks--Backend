import { IsString, IsEmail, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'Enter Your Password' })
  @MinLength(4)
  password: string;
}
