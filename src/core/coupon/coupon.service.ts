import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from 'src/schemas/categories.schema';
import { CategoriesService } from '../categories/categories.service';
import { isValidObjectId, Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Coupon, CouponDocument } from 'src/schemas/coupons.schema';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { UpdateCouponDto } from './dto/updateCoupon.dto';
@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<CategoriesService>,
  ) {}

  async createNewCoupon(
    data: CreateCouponDto,
    files: {
      bannerImage?: Express.Multer.File[];
      couponImage?: Express.Multer.File[];
    },
  ) {
    if (!isValidObjectId(data.brandId)) {
      throw new NotAcceptableException('Invalid Brand Object Id');
    }
    if (!isValidObjectId(data.category)) {
      throw new NotAcceptableException('Invalid Category Object Id');
    }
    const checkIsCategoryExist = await this.categoryModel.findById(
      data.category,
    );
    if (!checkIsCategoryExist) {
      throw new NotFoundException('this category id not found');
    }
    const checkIsBrandExist = await this.brandModel.findById(data.brandId);
    if (!checkIsBrandExist) {
      throw new NotFoundException('this brand id not found');
    }

    const task = await this.couponModel.create({
      ...data,
      bannerImage: files.bannerImage[0].path,
      couponImage: files.couponImage[0].path,
    });
    return {
      status: true,
      message: 'new coupon create successfully',
      data: task,
    };
  }

  async updateCoupon(
    data: UpdateCouponDto,
    id: string,
    files: {
      bannerImage?: Express.Multer.File[];
      couponImage?: Express.Multer.File[];
    },
  ) {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Coupon Object Id');
    }
    if (data.brandId) {
      if (!isValidObjectId(data.brandId)) {
        throw new NotAcceptableException('Invalid Brand Object Id');
      }
      const checkIsBrandExist = await this.brandModel.findById(data.brandId);
      if (!checkIsBrandExist) {
        throw new NotFoundException('this brand id not found');
      }
    }
    if (data.category) {
      if (!isValidObjectId(data.category)) {
        throw new NotAcceptableException('Invalid Category Object Id');
      }
      const checkIsCategoryExist = await this.categoryModel.findById(
        data.category,
      );
      if (!checkIsCategoryExist) {
        throw new NotFoundException('this category id not found');
      }
    }

    if (files.bannerImage) {
      data.bannerImage = files.bannerImage[0].path;
    }
    if (files.couponImage) {
      data.couponImage = files.couponImage[0].path;
    }

    const task = await this.couponModel.updateOne({ _id: id }, { $set: data });
    return {
      status: true,
      message: 'coupon update successfully',
      data: task,
    };
  }

  async deleteCoupon(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Coupon Object Id');
    }

    const task = await this.couponModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'Coupon delete successfully',
      data: task,
    };
  }

  async getCoupon(id: string):Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Coupon Object Id');
    }

    const task = await this.couponModel.findOne({ _id: id }).lean();
    const brand = await this.brandModel.findOne({ _id: id }).lean();

    if (!task) {
      throw new NotFoundException('Coupon Not Found');
    }

    return {
      ...task,
      isExpired: this.isExpired(task.expDate.toISOString()),
      brand,
    };
  }

  async getCoupons() {
    const task = await this.couponModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      {
        $unwind: '$categoryData',
      },
    ]);
    return task.map((e) => ({
      ...e,
      isExpired: this.isExpired(e.expDate.toISOString()),
    }));
  }

  async getCouponsActive() {
    const task = await this.couponModel.find({ isEnable: true }).lean();
    return task
      .filter((e) => !this.isExpired(e.expDate.toISOString()))
      .map((e) => ({ ...e, isExpired: false })) as any ;
  }

  private isExpired(expDate: string): boolean {
    // Create a Date object from the expiration date string
    const date = new Date(expDate);

    // Get the current date and time
    const now = new Date();

    // Compare the expiration date with the current date
    return date < now; // Returns true if the date is in the past
  }
}
