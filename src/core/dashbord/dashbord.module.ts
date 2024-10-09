import { Module } from '@nestjs/common';
import { DashbordController } from './dashbord.controller';
import { DashbordService } from './dashbord.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupons.schema';
import { Offers, OffersSchema } from 'src/schemas/offers.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Payout, PayoutSchema } from 'src/schemas/payouts.schema';
import { Transitions, TransitionsSchema } from 'src/schemas/transitions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Offers.name, schema: OffersSchema },
      { name: User.name, schema: UserSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: Transitions.name, schema: TransitionsSchema },
    ]),
  ],
  controllers: [DashbordController],
  providers: [DashbordService],
})
export class DashbordModule {}
