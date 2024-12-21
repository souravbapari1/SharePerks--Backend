import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtKey } from './constants/secret';
import { AuthController } from './core/auth/auth.controller';
import { AuthService } from './core/auth/auth.service';
import { AuthModule } from './core/auth/auth.module';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserModule } from './core/user/user.module';
import { Holdings, HoldingsSchema } from './schemas/holdings.schema';
import { BankModule } from './core/bank/bank.module';
import { Bank, BankSchema } from './schemas/bank.schema';
import { CategoriesModule } from './core/categories/categories.module';
import { BrandModule } from './core/brand/brand.module';
import { LogService } from './global/log/log.service';
import { Log, LogSchema } from './schemas/logs.schema';
import { LogModule } from './global/log/log.module';
import { OffersModule } from './core/offers/offers.module';
import { CouponModule } from './core/coupon/coupon.module';
import { PayoutModule } from './core/payout/payout.module';
import { TransitionModule } from './core/transition/transition.module';
import { FeedModule } from './core/feed/feed.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './processer/task/task.module';
import { CuelinksModule } from './core/cuelinks/cuelinks.module';
import { AppcontentModule } from './core/appcontent/appcontent.module';
import { TrackerModule } from './core/tracker/tracker.module';
import { DashbordModule } from './core/dashbord/dashbord.module';
import { GiftcardModule } from './core/giftcard/giftcard.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './global/notification/notification.module';
import { WhoowModule } from './core/whoow/whoow.module';
import { GiftcardService } from './core/giftcard/giftcard.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: jwtKey,
      signOptions: { expiresIn: '60d' },
    }),
    ScheduleModule.forRoot(),

    MongooseModule.forRoot(
      'mongodb+srv://sourav:sourav@sourav.s1kfe.mongodb.net/shareperks',
    ),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),

    AuthModule,
    UserModule,
    BankModule,
    CategoriesModule,
    BrandModule,
    LogModule,
    OffersModule,
    CouponModule,
    PayoutModule,
    TransitionModule,
    FeedModule,
    TaskModule,
    CuelinksModule,
    AppcontentModule,
    TrackerModule,
    DashbordModule,
    GiftcardModule,
    NotificationModule,
    WhoowModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
