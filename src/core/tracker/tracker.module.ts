import { Module } from '@nestjs/common';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupons.schema';
import { Offers, OffersSchema } from 'src/schemas/offers.schema';
import { LogService } from 'src/global/log/log.service';
import { LogModule } from 'src/global/log/log.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Offers.name, schema: OffersSchema },
      { name: User.name, schema: UserSchema },
    ]),
    LogModule,
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
