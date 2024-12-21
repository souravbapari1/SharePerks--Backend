import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWhoowPaymentSessionDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  cardAmount: number;

  @IsNotEmpty()
  amount: number;
}
