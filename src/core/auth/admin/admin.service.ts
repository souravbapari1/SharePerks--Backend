import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { CreateAdminDto } from './dto/create_admin.dto';
import { AdminLoginDto } from './dto/login_admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}
  async createAdmin(user: CreateAdminDto, file: Express.Multer.File) {
    Logger.log(user);

    const isEmailExist = await this.adminModel.findOne({ email: user.email });
    if (isEmailExist) {
      throw new NotAcceptableException('Email Already Exist');
    }
    const res = await this.adminModel.create({ ...user, image: file.path });
    delete res.password;
    return { status: true, message: 'Admin create successfully', user: res };
  }
  async login(user: AdminLoginDto) {
    const userData = await this.adminModel
      .findOne({
        email: user.email,
        password: user.password,
      })
      .lean();
    if (!userData) {
      throw new NotFoundException('Invalid Email or Password!');
    }
    delete userData.password;
    return {
      status: true,
      token: this.jwtService.sign(userData),
      user: userData,
    };
  }

  async getAllAdmins() {
    const admins = await this.adminModel.find().lean();
    return admins;
  }

  async getAdminById(id: string) {
    const admin = await this.adminModel.findById(id).lean();
    return admin;
  }

  async deleteAdmin(id: string) {
    const admin = await this.adminModel.findByIdAndDelete(id);
    return admin;
  }

  async updateAdmin(id: string, body: any) {
    const admin = await this.adminModel.findByIdAndUpdate(id, body);
    return admin;
  }
}
