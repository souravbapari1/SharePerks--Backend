import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Offers, OffersSchema } from 'src/schemas/offers.schema';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupons.schema';
import { TransitionModule } from 'src/core/transition/transition.module';
import { Transitions, TransitionsSchema } from 'src/schemas/transitions.schema';
import { CommitionService } from './commition.service';
import { AdmitadModule } from '../admitad/admitad.module';
import { CuelinksModule } from '../cuelinks/cuelinks.module';
import { Holdings, HoldingsSchema } from 'src/schemas/holdings.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Offers.name, schema: OffersSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Transitions.name, schema: TransitionsSchema },
      { name: Holdings.name, schema: HoldingsSchema },
    ]),
    AdmitadModule,
    CuelinksModule,
    TransitionModule,
  ],
  providers: [CommitionService],
  exports: [CommitionService],
})
export class CommitionModule {}
