import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Holdings, HoldingsDocument } from 'src/schemas/holdings.schema';
import { User } from 'src/schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { BankService } from '../bank/bank.service';
import { LogService } from 'src/global/log/log.service';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';
import { AdminDto } from './dto/admin.dto';
import { LogType } from 'src/constants/constents';
import { Payout, PayoutDocument } from 'src/schemas/payouts.schema';
import { TransitionService } from '../transition/transition.service';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,

    @InjectModel(Holdings.name)
    private readonly HoldingsModel: Model<HoldingsDocument>,
    @InjectModel(Payout.name)
    private readonly payoutModel: Model<PayoutDocument>,

    private readonly BankService: BankService,
    private readonly logService: LogService,
    private readonly transitionService: TransitionService,
  ) { }

  async getUser(user: UserDto) {
    const getHoldings = await this.HoldingsModel.findOne({ user: user._id });
    const getUser = await this.UserModel.findOne({ _id: user._id }).lean();
    const banks = await this.BankService.getBanks(user._id);
    const earnings = await this.transitionService.paymentInfo(user._id);
    if (!getUser) {
      throw new NotFoundException('user not found!');
    }
    delete getUser.otp;
    delete getUser.expOtp;
    return {
      status: true,
      user: getUser,
      holdings: getHoldings,
      banks: banks.banks,
      earnings,
    };
  }

  async updateUser(
    user: UserDto,
    updateData: UserDto,
    image?: Express.Multer.File,
  ) {
    await this.UserModel.updateOne({ _id: user._id }, updateData);
    if (image) {
      await this.UserModel.updateOne(
        { _id: user._id },
        {
          image: image.path,
        },
      );
    }
    console.log(image);

    const userData = await this.getUser(user);
    return {
      message: 'user Update Successfully',
      ...userData,
    };
  }

  async connectBrokerUser(user: UserDto, holdings: any) {
    // Update the brokerConnected field for the user
    await this.UserModel.updateOne(
      { _id: user._id },
      { brokerConnected: true },
    );

    // Update or insert the holdings for the user
    await this.HoldingsModel.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        data: holdings,
      },
      {
        new: true,
        upsert: true,
      },
    );

    // Fetch updated user data
    const userData = await this.getUser(user);
    // Add A Log =========
    await this.logService.createNewLog({
      title: `${userData.user.name} Connect To SmallCase`,
      type: LogType.SMALLCASE_ACTIVITY,
      description: 'User Connect There SmallCase Account or Import Holdings',
      user: user._id,
      data: userData.holdings,
    });
    //===============
    return {
      message: 'User holding imported successfully',
      ...userData,
    };
  }

  async getAdmin(id: string) {
    const data = await this.adminModel.findOne({ _id: id }).lean();
    delete data.password;
    return data;
  }

  async updateAdmin(id: string, update: AdminDto, image?: Express.Multer.File) {
    const user = await this.adminModel.findOne({ _id: id }).lean();
    if (image) {
      update.image = image.path;
    }
    if (update.password) {
      if (!update.newpassword) {
        throw new NotAcceptableException('Please Enter new Password');
      }
      if (user.password == update.password) {
        update.password = update.newpassword;
        delete update.newpassword;
      } else {
        throw new NotAcceptableException('Incorrect Password');
      }
    }
    console.log(update);

    const task = await this.adminModel.updateOne({ _id: id }, update).lean();
    const data = await this.adminModel.findOne({ _id: id }).lean();
    console.log(data);

    delete data.password;
    return {
      status: true,
      message: 'admin update successfully',
      user: data,
      data: task,
    };
  }

  async getUsers() {
    const data = await this.UserModel.find({}, { expOtp: 0, otp: 0 }).lean();
    return data;
  }


  async blockUnblockUser(id: string) {
    const user = await this.UserModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    await this.UserModel.updateOne({ _id: id }, { isBlocked: !user.isBlocked });
    return {
      status: true,
      message: `User ${user.name} has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      user: user,
    };
  }

  async getPaginationUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const data = await this.UserModel.find({}, { expOtp: 0, otp: 0 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.UserModel.countDocuments();

    return {
      users: data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    };
  }

  async searchUsers(search: string) {
    const data = await this.UserModel.find({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$mobile' },
              regex: search,
              options: 'i',
            },
          },
        },
      ],
    }).lean();
    return data;
  }

  async getFullUser(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid User ID');
    }
    const data = await this.UserModel.findOne(
      { _id: id },
      { expOtp: 0, otp: 0 },
    ).lean();
    const banks = await this.BankService.getBanks(id);
    const holdings = await this.HoldingsModel.findOne({ user: id });
    const logs = await this.logService.getUserLogs(id);
    const payouts = await this.payoutModel
      .find({ user: id })
      .sort({ createdAt: -1 });

    return {
      user: data,
      banks: banks.banks,
      holdings: holdings,
      logs: logs,
      payouts: payouts,
    };
  }

  // get use rnOtofication

  async getUserNotification(id: string) {
    const data = await this.notificationModel.find({ user: id }).lean();
    return data;
  }


  async getMyReferUser(id: string) {
    const data = await this.UserModel.find({ referByUser: id }, { expOtp: 0, otp: 0, walletAmount: 0, mobile: 0, email: 0 }).lean();
    return data;
  }


  async deleteUserNotification(id: string) {
    const data = await this.notificationModel.deleteMany({ user: id });
    return data;
  }

  async getUserEmails() {
    const data = await this.UserModel.find({ emailAlerts: true }).lean();
    return data.map((e) => e.email);
  }
}
