import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the admin account',
    example: 'securePassword123',
  })
  @IsString({ message: 'Enter Your Password' })
  @MinLength(4)
  password: string;
}
