import { Module } from '@nestjs/common';
import { GiftcardorderModule } from 'src/core/giftcardorder/giftcardorder.module';
import { AdmitadModule } from './admitad/admitad.module';
import { CommitionModule } from './commition/commition.module';
import { CuelinksModule } from './cuelinks/cuelinks.module';
import { TaskService } from './task.service';
import { VouchagramModule } from './vouchagram/vouchagram.module';
import { WhoowApiModule } from './whoow/whoow.module';
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
import { WhooCard, WhooCardSchema } from 'src/schemas/whoohcards.schema';
import {
  VouchagramBrands,
  VouchagramBrandsSchema,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';

@Module({
  imports: [
    VouchagramModule,
    CuelinksModule,
    AdmitadModule,
    CommitionModule,
    WhoowApiModule,
    GiftcardorderModule,
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
  providers: [TaskService],
})
export class TaskModule {}
