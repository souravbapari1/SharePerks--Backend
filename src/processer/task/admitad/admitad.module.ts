import { Module } from '@nestjs/common';
import { AdmitadService } from './admitad.service';
import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Offers, OffersSchema } from 'src/schemas/offers.schema';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupons.schema';
import { TransitionModule } from 'src/core/transition/transition.module';
import { Transitions, TransitionsSchema } from 'src/schemas/transitions.schema';
import { Admitad, AdmitadSchema } from 'src/schemas/admitad/admitad.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Offers.name, schema: OffersSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Transitions.name, schema: TransitionsSchema },
      { name: Admitad.name, schema: AdmitadSchema },
    ]),
    TransitionModule,
  ],
  providers: [AdmitadService],
  exports: [AdmitadService],
})
export class AdmitadModule {}
