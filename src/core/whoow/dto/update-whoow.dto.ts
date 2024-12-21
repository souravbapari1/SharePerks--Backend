import { PartialType } from '@nestjs/swagger';
import { CreateWhoowDto } from './create-whoow.dto';

export class UpdateWhoowDto extends PartialType(CreateWhoowDto) {}
