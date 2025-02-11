import { Module } from '@nestjs/common';
import { TransitionController } from './transition.controller';
import { TransitionService } from './transition.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from 'src/global/log/log.module';
import { Transitions, TransitionsSchema } from 'src/schemas/transitions.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Payout, PayoutSchema } from 'src/schemas/payouts.schema';
import { ReferReward, ReferRewardSchema } from 'src/schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transitions.name, schema: TransitionsSchema },
      { name: User.name, schema: UserSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: Payout.name, schema: PayoutSchema },
      {
        name: ReferReward.name,
        schema: ReferRewardSchema,
      },
    ]),
    LogModule,
  ],
  controllers: [TransitionController],
  providers: [TransitionService],
  exports: [TransitionService],
})
export class TransitionModule {}
