import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Payment, PaymentSchema } from 'src/schemas/payment.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { WhooCard, WhooCardSchema } from 'src/schemas/whoohcards.schema';
import { GiftcardModule } from '../giftcard/giftcard.module';
import { WhoowController } from './whoow.controller';
import { WhoowService } from './whoow.service';
import { LogModule } from 'src/global/log/log.module';
import { WhoowApiModule } from 'src/processer/task/whoow/whoow.module';
import {
  VouchagramError,
  vouchagramErrorSchema,
} from 'src/schemas/vouchagram/vouchagramError.schema';
import { GiftcardorderModule } from '../giftcardorder/giftcardorder.module';

@Module({
  imports: [
    GiftcardModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: WhooCard.name, schema: WhooCardSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
      {
        name: VouchagramError.name,
        schema: vouchagramErrorSchema,
      },
    ]),
    LogModule,
    WhoowApiModule,
  ],
  controllers: [WhoowController],
  providers: [WhoowService],
  exports: [WhoowService, WhoowModule],
})
export class WhoowModule {}
