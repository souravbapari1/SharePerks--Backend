import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { LogService } from 'src/global/log/log.service';
import {
  Transitions,
  TransitionsDocument,
} from 'src/schemas/transitions.schema';
import { CreateTransitionsDto } from './dto/createTransitions.dto';
import { UpdateTransitionsDto } from './dto/updateTransitions.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LogType, TransitionsType } from 'src/constants/constents';
import { PayoutModule } from '../payout/payout.module';
import { Payout, PayoutDocument } from 'src/schemas/payouts.schema';
import { ObjectId } from 'bson';
import { ReferReward, ReferRewardDocument } from 'src/schemas/reward.schema';
import { retry } from 'rxjs';

@Injectable()
export class TransitionService {
  constructor(
    @InjectModel(Transitions.name)
    private readonly transitionsModel: Model<TransitionsDocument>,

    @InjectModel(Payout.name)
    private readonly payoutModel: Model<PayoutDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(ReferReward.name)
    private readonly referRewardModel: Model<ReferRewardDocument>,

    private readonly logService: LogService,
  ) {}

  async getUserTransitions(userId: string) {
    const transitions = await this.transitionsModel.aggregate([
      {
        $match: {
          user: { $eq: new ObjectId(userId) },
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandData',
        },
      },
      {
        $unwind: {
          path: '$brandData',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return transitions;
  }

  async getAllTransitions() {
    const transitions = await this.transitionsModel.aggregate([
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandData',
        },
      },
      {
        $unwind: {
          path: '$brandData', // Corrected from 'bradData' to 'brandData'
          preserveNullAndEmptyArrays: true, // In case no matching brand is found
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: {
          path: '$userData', // Corrected from 'bradData' to 'brandData'
          preserveNullAndEmptyArrays: true, // In case no matching brand is found
        },
      },
    ]);

    return transitions;
  }

  async getUserTransitionsType(userId: string, type: string) {
    const transitions = await this.transitionsModel.find({
      user: userId,
      type: type,
    });
    return transitions;
  }

  async createUserTransition(transition: CreateTransitionsDto) {
    if (!isValidObjectId(transition.user)) {
      throw new NotAcceptableException('Invalid User ID');
    }
    const findUser = await this.userModel.findById(transition.user);
    if (!findUser) {
      throw new NotFoundException('User Not Found this ID');
    }
    const task = await this.transitionsModel.create(transition);
    await this.logService.createNewLog({
      title: transition.title,
      type: LogType.TRANSITS_ACTIVITY,
      user: transition.user,
      data: transition.data,
      description: transition.subtitle,
    });
    return {
      status: true,
      message: 'transition added successfully',
      data: task,
    };
  }

  async updateUserTransition(transition: UpdateTransitionsDto, id: string) {
    if (!isValidObjectId(transition.user)) {
      throw new NotAcceptableException('Invalid User ID');
    }
    const findUser = await this.userModel.findById(transition.user);
    if (!findUser) {
      throw new NotFoundException('User Not Found this ID');
    }
    const task = await this.transitionsModel.updateOne({ _id: id }, transition);
    await this.logService.createNewLog({
      title: transition.title,
      type: LogType.TRANSITS_ACTIVITY,
      user: transition.user,
      data: transition.data,
      description: transition.subtitle,
    });
    return {
      status: true,
      message: 'transition update successfully',
      data: task,
    };
  }

  async paymentInfo(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    const payouts = await this.payoutModel.find({
      user: id,
      status: { $nin: ['cancel', 'failed'] },
    });

    const transitions = await this.transitionsModel.find({
      user: id,
      status: { $nin: [TransitionsType.REFERRAL] },
      type: { $nin: ['cancel'] },
    });

    const transitionsRefer = await this.transitionsModel.find({
      user: id,
      status: 'confirm',
      completePayment: true,
      type: TransitionsType.REFERRAL,
    });

    const transitionsPending = await this.transitionsModel.find({
      user: id,
      status: 'pending',
      completePayment: true,
      type: TransitionsType.COMMOTION,
    });

    const totalPayouts = payouts.reduce((sum, item) => sum + item.amount, 0);
    const totalRefer = transitionsRefer.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const totalTransitions = transitions.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const totalTransitionsPending = transitions.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const wallet = user.walletAmount;

    return {
      totalPayouts,
      totalRefer,
      totalTransitions,
      totalTransitionsPending,
      wallet,
    };
  }

  async getReferralReword() {
    const data = await this.referRewardModel.findOne({});
    if (!data) {
      await this.setReferralReward({
        refererAmount: 0,
        referralAmount: 0,
      });
      return await this.getReferralReword();
    }
    return data;
  }

  async setReferralReward(data: {
    refererAmount: number;
    referralAmount: number;
  }) {
    return await this.referRewardModel.findOneAndUpdate(
      {},
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
}
