import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { OffersModule } from '../offers/offers.module';
import { CategoriesModule } from '../categories/categories.module';
import { BrandModule } from '../brand/brand.module';
import { CouponModule } from '../coupon/coupon.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    OffersModule,
    CategoriesModule,
    BrandModule,
    CouponModule,
    UserModule,
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
