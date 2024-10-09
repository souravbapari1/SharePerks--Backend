import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { Types } from 'mongoose';

export class LogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  user: string;

  @IsObject()
  @IsOptional()
  data?: any;
}
