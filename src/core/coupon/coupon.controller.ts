import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';

import { createFileFilter } from 'src/pipes/file-validate/file-validate.pipe';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { UpdateCouponDto } from './dto/updateCoupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}
  @Get()
  async getCoupons() {
    return await this.couponService.getCouponsActive();
  }

  @Get()
  async getCouponsActive() {
    return await this.couponService.getCouponsActive();
  }

  @Get('all')
  async getCouponsAll() {
    return await this.couponService.getCoupons();
  }

  @Get(':id')
  async getOffer(@Param('id') id: string):Promise<any> {
    return await this.couponService.getCoupon(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'couponImage', maxCount: 1 },
      ],
      {
        fileFilter: createFileFilter(
          ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
          8 * 1024 * 1024, // 8MB max size
        ),
        storage,
      },
    ),
  )
  async createCoupon(
    @Body() body: CreateCouponDto,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      couponImage?: Express.Multer.File[];
    },
  ) {
    if (typeof body.commissionRate === 'string')
      body.commissionRate = JSON.parse(body.commissionRate);
    if (typeof body.isEnable === 'string')
      body.isEnable = JSON.parse(body.isEnable);

    if (typeof body.couponKeyPoints === 'string')
      body.couponKeyPoints = JSON.parse(body.couponKeyPoints);

    if (!files.bannerImage) {
      throw new NotAcceptableException('Please Add Banner image File');
    }

    if (!files.couponImage) {
      throw new NotAcceptableException('Please Add coupon image File');
    }

    return await this.couponService.createNewCoupon(body, files);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'couponImage', maxCount: 1 },
      ],
      {
        fileFilter: createFileFilter(
          ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
          8 * 1024 * 1024, // 8MB max size
        ),
        storage,
      },
    ),
  )
  async updateOffer(
    @Param('id') id: string,
    @Body() body: UpdateCouponDto,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      couponImage?: Express.Multer.File[];
    },
  ) {
    if (typeof body.commissionRate === 'string')
      body.commissionRate = JSON.parse(body.commissionRate);
    if (typeof body.isEnable === 'string')
      body.isEnable = JSON.parse(body.isEnable);

    if (typeof body.couponKeyPoints === 'string')
      body.couponKeyPoints = JSON.parse(body.couponKeyPoints);

    return await this.couponService.updateCoupon(body, id, files);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteOffer(@Param('id') id: string) {
    return await this.couponService.deleteCoupon(id);
  }
}
