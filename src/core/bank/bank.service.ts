import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank, BankDocument } from 'src/schemas/bank.schema';
import { UserDto } from '../user/dto/user.dto';
import { CreateBankDto } from './dto/createBank.dto';
import { UpdateBankDto } from './dto/updateBank.dto';
import { LogService } from 'src/global/log/log.service';
import { LogType } from 'src/constants/constents';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name) private readonly bankModel: Model<BankDocument>,
    private readonly logService: LogService,
  ) {}

  async createBank(user: UserDto, bank: CreateBankDto) {
    const existBank = await this.bankModel.findOne({
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      user: user._id,
    });

    if (existBank) {
      throw new NotAcceptableException('this bank is already exist');
    }

    const bankNew = await this.bankModel.create({ ...bank, user: user._id });
    const banks = await this.getBanks(user._id);
    // Add A Log =========
    await this.logService.createNewLog({
      title: `${user.mobile} Add bank Account`,
      type: LogType.USER_ACTIVITY,
      description: 'User New Add New Bank Account',
      user: user._id,
      data: bankNew,
    });
    //===============
    return {
      status: true,
      message: 'New Bank added Successfully',
      bank: bankNew,
      banks: banks.banks,
    };
  }

  async updateBank(id: string, user: UserDto, bank: UpdateBankDto) {
    const bankNew = await this.bankModel.updateOne({ _id: id }, bank);
    const banks = await this.getBanks(user._id);
    return {
      status: true,
      process: bankNew,
      message: 'Bank update Successfully',
      banks: banks.banks,
    };
  }

  async deleteBank(id: string) {
    await this.bankModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'Bank delete Successfully',
    };
  }

  async getBank(id: string) {
    const bank = await this.bankModel.findOne({ _id: id });
    if (!bank) {
      throw new NotFoundException('Bank Not Found!');
    }
    return {
      status: true,
      bank,
    };
  }

  async getBanks(userId: string) {
    const banks = await this.bankModel.find({ user: userId });
    return {
      status: true,
      banks,
    };
  }
}
