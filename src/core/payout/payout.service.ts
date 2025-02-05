import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { LogService } from 'src/global/log/log.service';
import { Payout, PayoutDocument } from 'src/schemas/payouts.schema';
import { CreatePayoutDto } from './dto/createPayout.dto';
import { Bank, BankDocument } from 'src/schemas/bank.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LogType } from 'src/constants/constents';
import { UpdatePayoutDto } from './dto/updatePayout.dto';
import { NotificationService } from 'src/global/notification/notification.service';

@Injectable()
export class PayoutService {
  constructor(
    @InjectModel(Payout.name)
    private readonly payoutModel: Model<PayoutDocument>,
    @InjectModel(Bank.name)
    private readonly bankModel: Model<BankDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly logService: LogService,
    private readonly notification: NotificationService,
  ) {}
  async createNewPayout(data: CreatePayoutDto) {
    if (!isValidObjectId(data.bank)) {
      throw new NotAcceptableException('Invalid Bank ID');
    }

    const bankExist = await this.bankModel.findById(data.bank).lean();
    const userInfo = await this.userModel.findById(data.user);

    if (!userInfo) {
      throw new NotFoundException('User Not Found On This ID');
    }

    if (!bankExist) {
      throw new NotFoundException('Bank Not Found On This ID');
    }

    if (data.amount < 100) {
      throw new NotAcceptableException('Minimum payout 100 rs');
    }

    if (userInfo.walletAmount < data.amount) {
      throw new NotAcceptableException('Insufficient Wallet Balance');
    }
    await userInfo.updateOne({
      walletAmount: userInfo.walletAmount - data.amount,
    });

    //==== Add LOG ====
    await this.logService.createNewLog({
      title: `${userInfo.name} Create New Payout Request`,
      type: LogType.PAYOUT_ACTIVITY,
      user: userInfo._id.toString(),
      data: data,
      description: `new payout request ${data.amount} rs`,
    });
    // await this.notification.sendNotificationQuickUser({
    //   id: userInfo._id.toString(),
    //   title: `Payout Request Send`,
    //   message: `Your payout request ${data.amount} rs send successfully`,
    // });
    //==================

    data.bank = bankExist;
    const task = await this.payoutModel.create(data);
    return {
      status: true,
      message: 'payout request send successfully',
      data: task,
    };
  }

  async updatePayout(data: UpdatePayoutDto, id: string) {
    delete data.bank;
    delete data.user;
    delete data.amount;

    const task = await this.payoutModel.findOneAndUpdate({ _id: id }, data);
    const user = await this.userModel.findOne({ _id: task.user });

    // await this.notification.sendNotificationQuickUser({
    //   id: user._id.toString(),
    //   title: `Payout has been ${data.status}`,
    //   message: `Your payout request has been ${data.status}`,
    // });
    return {
      status: true,
      message: 'payout request update successfully',
      data: task,
    };
  }

  async getUserPayouts(id: string) {
    const task = (await this.payoutModel.find({ user: id })).reverse();
    return task;
  }

  async getUserPayoutsFilter(id: string, status: string) {
    const task = await this.payoutModel.find({ user: id, status });
    return task;
  }

  async getPayouts() {
    const task = await this.payoutModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $addFields: {
          userData: { $arrayElemAt: ['$userData', 0] },
        },
      },
      {
        $project: {
          'userData.otp': 0,
          'userData.expOtp': 0,
        },
      },
    ]);
    return task;
  }

  async getPaginationPayouts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const payouts = await this.payoutModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $addFields: {
          userData: { $arrayElemAt: ['$userData', 0] },
        },
      },
      {
        $project: {
          'userData.otp': 0,
          'userData.expOtp': 0,
        },
      },
      { $sort: { _id: -1 } }, // Sort by newest payouts first
      { $skip: skip }, // Skip records for pagination
      { $limit: limit }, // Limit number of records
    ]);

    const total = await this.payoutModel.countDocuments();

    return {
      payouts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPayouts: total,
    };
  }

  async getPayoutsFilter(status: string) {
    const task = await this.payoutModel.aggregate([
      {
        $match: {
          status: { $eq: status },
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
        $addFields: {
          userData: { $arrayElemAt: ['$userData', 0] },
        },
      },
      {
        $project: {
          'userData.otp': 0,
          'userData.expOtp': 0,
        },
      },
    ]);
    return task;
  }

  async getPayoutsFilterPagination(
    status: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const payouts = await this.payoutModel.aggregate([
      {
        $match: {
          status: status, // Match status
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
        $addFields: {
          userData: { $arrayElemAt: ['$userData', 0] }, // Extract first user object
        },
      },
      {
        $project: {
          'userData.otp': 0,
          'userData.expOtp': 0, // Exclude sensitive user data
        },
      },
      { $sort: { _id: -1 } }, // Sort by newest payouts first
      { $skip: skip }, // Skip records for pagination
      { $limit: limit }, // Limit number of records per page
    ]);

    // Count total filtered records for pagination
    const total = await this.payoutModel.countDocuments({ status });

    return {
      payouts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPayouts: total,
    };
  }
}
