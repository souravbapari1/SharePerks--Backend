import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashFreeModule } from 'src/global/cash-free/cash-free.module';
import { LogModule } from 'src/global/log/log.module';
import { NotificationModule } from 'src/global/notification/notification.module';
import { VouchagramModule } from 'src/processer/task/vouchagram/vouchagram.module';
import { WhoowApiModule } from 'src/processer/task/whoow/whoow.module';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import {
  MyGiftCards,
  MyGiftCardsSchema,
} from 'src/schemas/payment/cards.schema';
import {
  GiftCardErrors,
  GiftCardErrorsSchema,
} from 'src/schemas/payment/errorcards.schema';
import {
  GiftCardPayments,
  GiftCardPaymentsSchema,
} from 'src/schemas/payment/paymentorders.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  VouchagramBrands,
  VouchagramBrandsSchema,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';
import { WhooCard, WhooCardSchema } from 'src/schemas/whoohcards.schema';
import { GiftcardorderController } from './giftcardorder.controller';
import { GiftcardorderService } from './giftcardorder.service';

@Module({
  imports: [
    VouchagramModule,
    WhoowApiModule,
    LogModule,
    CashFreeModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
      { name: GiftCardPayments.name, schema: GiftCardPaymentsSchema },
      { name: GiftCardErrors.name, schema: GiftCardErrorsSchema },
      { name: MyGiftCards.name, schema: MyGiftCardsSchema },
      { name: WhooCard.name, schema: WhooCardSchema },
      { name: VouchagramBrands.name, schema: VouchagramBrandsSchema },
    ]),
  ],
  controllers: [GiftcardorderController],
  providers: [GiftcardorderService],
  exports: [GiftcardorderModule, GiftcardorderService],
})
export class GiftcardorderModule {}
