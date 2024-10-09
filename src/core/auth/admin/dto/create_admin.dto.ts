import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The name of the admin',
    example: 'Admin User',
  })
  @IsString()
  name: string;

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
  @IsString()
  password: string;
}
