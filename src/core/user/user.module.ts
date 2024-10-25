import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Holdings, HoldingsSchema } from 'src/schemas/holdings.schema';
import { BankService } from '../bank/bank.service';
import { Bank, BankSchema } from 'src/schemas/bank.schema';
import { BankModule } from '../bank/bank.module';
import { LogModule } from 'src/global/log/log.module';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { Payout, PayoutSchema } from 'src/schemas/payouts.schema';
import { TrackerModule } from '../tracker/tracker.module';
import { TransitionModule } from '../transition/transition.module';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Holdings.name, schema: HoldingsSchema },
      { name: Bank.name, schema: BankSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    TrackerModule,
    TransitionModule,
    LogModule,
  ],
  controllers: [UserController],
  providers: [UserService, BankService],
  exports: [UserService],
})
export class UserModule {}
