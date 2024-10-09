import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dio/createUserDto.dto';
import { VerifyUserOtpDto } from './dio/verifyUserOtp.dto';
import { CompleteUserDto } from './dio/completeUse.dto';
import { LogService } from 'src/global/log/log.service';
import { LogType } from 'src/constants/constents';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly logService: LogService,
  ) {}

  async authAUser(user: CreateUserDto) {
    const otp = this.generateOTP(4);
    let res = await this.userModel.findOne({ mobile: user.mobile });
    if (!res) {
      const referCode = await this.generateReferCode();
      res = await this.userModel.create({
        mobile: user.mobile,
        referCode: referCode,
      });
      // Add A Log
      await this.logService.createNewLog({
        title: `${user.mobile} Join New user`,
        type: LogType.USER_ACTIVITY,
        description: 'User New Join In Our App',
        user: res._id.toString(),
        data: res,
      });
    }
    await res.updateOne({ otp, expOtp: this.getDate30MinutesLater() });
    await this.sendOtp(user.mobile, otp);

    return {
      status: true,
      message: 'Otp send successfully',
      user,
    };
  }

  async reSendOtp(user: CreateUserDto) {
    return await this.authAUser(user);
  }

  async verifyUserOtp(user: VerifyUserOtpDto) {
    let res = await this.userModel.findOne({ mobile: user.mobile }).lean();
    if (!res) {
      throw new NotFoundException('User Not Found with this Number');
    }
    if (res.otp !== user.otp) {
      throw new NotAcceptableException('Otp is incorrect! Enter a valid Otp');
    }

    // Check if OTP is expired
    if (res.expOtp == null || this.isOtpExpired(res.expOtp)) {
      throw new NotAcceptableException('Otp expired');
    }

    delete res.otp;
    delete res.expOtp;
    await this.userModel.updateOne(
      { _id: res._id },
      { expOtp: null, otp: null, brokerConnected: false },
    );
    return {
      status: true,
      user: res,
      token: this.jwtService.sign(res),
    };
  }

  async completeProfile(id: string, user: CompleteUserDto) {
    const userData = await this.userModel.findById(id);
    if (!userData) {
      throw new NotFoundException('User Not Found!');
    }
    let updateData: any = {
      name: user.name,
      email: user.email,
      completeProfile: true,
    };
    // here Fefet Task
    if (user.referCode) {
      const referUserData = await this.userModel.findOne({
        referCode: user.referCode,
      });
      if (!referUserData) {
        throw new NotFoundException('Invalid Refer Code');
      }
      if (referUserData._id == userData._id) {
        throw new NotFoundException('Invalid Refer Code');
      }
      updateData['referByUser'] = referUserData._id;
      updateData['referByCode'] = referUserData.referByCode;
      updateData['referPaymentComplete'] = false;
    }
    await userData.updateOne(updateData);

    let data = await this.userModel.findById(id).lean();
    delete data.otp;
    delete data.expOtp;
    // Add A Log =========
    await this.logService.createNewLog({
      title: `${data.name} Profile Complete`,
      type: LogType.USER_ACTIVITY,
      description: 'User New Complete Our Profile',
      user: data._id.toString(),
      data: data,
    });
    //===============
    return data;
  }

  private async sendOtp(mobile: number, otp: number) {
    try {
      const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
      };

      const req = await fetch(
        `https://api.kaleyra.io/v1/HXIN1805911502IN/messages?api-key=Aa0525ee27a38a299fa2be11bedcb20f8&to=91${mobile}&type=OTP&sender=SHPERK&body=Dear Investor,\n${otp} is the OTP to sign up to your Shareperks account. The OTP is strictly confidential; please do not disclose it to anyone.\nRegards,\nTeam Shareperks&template_id=1207172502771915866&Content-Type=application/x-www-form-urlencoded`,
        requestOptions,
      );
      const data: OTPRES = await req.json();
      return data;
    } catch (error) {
      throw new InternalServerErrorException(
        'Otp Send Failed! Please Try again later',
      );
    }
  }

  private generateOTP(length: number) {
    // Initialize an empty string to hold the OTP
    let otp = '';

    // Generate the first digit (ensure it's between 1 and 9 to avoid starting with 0)
    otp += Math.floor(Math.random() * 9) + 1; // 1-9

    // Loop for the remaining digits
    for (let i = 1; i < length; i++) {
      // Generate a random number between 0 and 9 for the remaining digits
      otp += Math.floor(Math.random() * 10);
    }

    // Return the generated OTP as an integer
    return parseInt(otp);
  }

  private getDate30MinutesLater(min = 30) {
    const currentDate = new Date();
    const newDate = new Date(currentDate.getTime() + min * 60000); // 60000 ms = 1 minute
    return newDate;
  }

  private isOtpExpired(expOtp: Date) {
    const currentDate = new Date();
    return currentDate > expOtp;
  }

  private async generateReferCode() {
    const user = await this.userModel.find().countDocuments();
    const code = this.generateOTP(5).toString() + user.toString();
    return +code;
  }
}

interface OTPRES {
  body: string;
  sender: string;
  type: string;
  source: string;
  template_id: string;
  id: string;
  createdDateTime: string;
  totalCount: number;
  data: Daum[];
  error: Error;
}

export interface Daum {
  message_id: string;
  recipient: string;
}

export interface Error {}
