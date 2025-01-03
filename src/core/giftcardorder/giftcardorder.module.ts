import { Module } from '@nestjs/common';
import { GiftcardorderService } from './giftcardorder.service';
import { GiftcardorderController } from './giftcardorder.controller';
import { CashFreeModule } from 'src/global/cash-free/cash-free.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  GiftCardPayments,
  GiftCardPaymentsSchema,
} from 'src/schemas/payment/paymentorders.schema';
import {
  GiftCardErrors,
  GiftCardErrorsSchema,
} from 'src/schemas/payment/errorcards.schema';
import {
  MyGiftCards,
  MyGiftCardsSchema,
} from 'src/schemas/payment/cards.schema';
import { VouchagramModule } from 'src/processer/task/vouchagram/vouchagram.module';
import { LogModule } from 'src/global/log/log.module';
import { WhoowApiModule } from 'src/processer/task/whoow/whoow.module';
import {
  VouchagramBrands,
  VouchagramBrandsSchema,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';
import { WhooCard, WhooCardSchema } from 'src/schemas/whoohcards.schema';

@Module({
  imports: [
    VouchagramModule,
    WhoowApiModule,
    LogModule,
    CashFreeModule,
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
})
export class GiftcardorderModule {}
