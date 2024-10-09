import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'The name of the admin (optional)',
    example: 'Admin User',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The email address of the admin (optional)',
    example: 'admin@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password for the admin account (optional)',
    example: 'securePassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}
