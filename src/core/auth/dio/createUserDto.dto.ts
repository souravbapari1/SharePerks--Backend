import { IsInt, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  mobile: number;
}
