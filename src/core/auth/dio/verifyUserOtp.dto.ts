import { IsInt, IsString } from 'class-validator';

export class VerifyUserOtpDto {
  @IsInt()
  mobile: number;

  @IsInt()
  otp: number;
}
