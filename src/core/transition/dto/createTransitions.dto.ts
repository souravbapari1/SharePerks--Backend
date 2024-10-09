import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransitionsDto {
  @IsString()
  @IsOptional()
  transitions_id?: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsBoolean()
  @IsOptional()
  completePayment?: boolean;

  @IsNotEmpty()
  user: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  typeDocId?: string;

  @IsNotEmpty()
  data: any;
}
