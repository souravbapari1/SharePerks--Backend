import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The mobile number of the user',
    example: 1234567890,
  })
  @IsInt()
  mobile: number;
}
