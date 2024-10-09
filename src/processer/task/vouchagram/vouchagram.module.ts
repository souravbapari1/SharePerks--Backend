import { Module } from '@nestjs/common';
import { VouchagramService } from './vouchagram.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VouchagramToken,
  VouchagramTokenSchema,
} from 'src/schemas/vouchagram/vouchagramtoken.schema';

import {
  VouchagramStores,
  VouchagramStoresSchema,
} from 'src/schemas/vouchagram/vouchagramStores.schema';
import {
  VouchagramBrands,
  VouchagramBrandsSchema,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: VouchagramToken.name, schema: VouchagramTokenSchema },
      { name: VouchagramBrands.name, schema: VouchagramBrandsSchema },
      { name: VouchagramStores.name, schema: VouchagramStoresSchema },
    ]),
  ],
  providers: [VouchagramService],
  exports: [VouchagramService],
})
export class VouchagramModule {}
