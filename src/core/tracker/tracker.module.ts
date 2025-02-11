import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from 'src/global/log/log.module';
import { Brand, BrandSchema } from 'src/schemas/brand.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupons.schema';
import { Log, LogSchema } from 'src/schemas/logs.schema';
import { Offers, OffersSchema } from 'src/schemas/offers.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Offers.name, schema: OffersSchema },
      { name: User.name, schema: UserSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    LogModule,
  ],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
