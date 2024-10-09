import { Module } from '@nestjs/common';
import { GiftcardController } from './giftcard.controller';
import { GiftcardService } from './giftcard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftCard, GiftCardSchema } from 'src/schemas/giftcard.schema';
import {
  VouchagramBrands,
  VouchagramBrandsSchema,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';
import {
  VouchagramStores,
  VouchagramStoresSchema,
} from 'src/schemas/vouchagram/vouchagramStores.schema';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { VouchagramModule } from 'src/processer/task/vouchagram/vouchagram.module';
import { HttpModule } from '@nestjs/axios';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { LogModule } from 'src/global/log/log.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: GiftCard.name, schema: GiftCardSchema },
      { name: VouchagramBrands.name, schema: VouchagramBrandsSchema },
      { name: VouchagramStores.name, schema: VouchagramStoresSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    VouchagramModule,
    LogModule,
  ],
  controllers: [GiftcardController],
  providers: [GiftcardService],
  exports: [GiftcardService],
})
export class GiftcardModule {}
