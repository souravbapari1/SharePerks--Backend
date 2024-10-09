import { Module } from '@nestjs/common';
import { PayoutController } from './payout.controller';
import { PayoutService } from './payout.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payout, PayoutSchema } from 'src/schemas/payouts.schema';
import { LogModule } from 'src/global/log/log.module';
import { Bank, BankSchema } from 'src/schemas/bank.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payout.name, schema: PayoutSchema },
      { name: Bank.name, schema: BankSchema },
      { name: User.name, schema: UserSchema },
    ]),
    LogModule,
  ],
  controllers: [PayoutController],
  providers: [PayoutService],
})
export class PayoutModule {}