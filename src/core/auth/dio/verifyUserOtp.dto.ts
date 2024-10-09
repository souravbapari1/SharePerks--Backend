import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserOtpDto {
  @ApiProperty({
    description: 'The mobile number of the user',
    example: 1234567890,
  })
  @IsInt()
  mobile: number;

  @ApiProperty({
    description: 'The OTP (One-Time Password) for verification',
    example: 1234,
  })
  @IsInt()
  otp: number;
}
