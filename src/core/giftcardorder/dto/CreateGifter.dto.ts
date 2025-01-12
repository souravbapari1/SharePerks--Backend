import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGifterDto {
  @IsNotEmpty()
  brandProductCode: string;

  @IsNotEmpty()
  @IsNumber()
  denomination: number;

  @IsNotEmpty()
  @IsNumber()
  payAmount: number;

  @IsNotEmpty()
  user: string;
}
