import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogType } from 'src/constants/constents';
import { LogService } from 'src/global/log/log.service';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Coupon, CouponDocument } from 'src/schemas/coupons.schema';
import { Offers, OffersDocument } from 'src/schemas/offers.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class TrackerService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
    @InjectModel(Offers.name)
    private readonly offerModel: Model<OffersDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly logService: LogService,
  ) {}

  async getLink({
    id,
    type,
    user,
  }: {
    id: string;
    type: 'brand' | 'coupon' | 'offer';
    user: string;
  }) {
    if (type == 'brand') {
      return await this.brandTask(id, user);
    }
    if (type == 'offer') {
      return await this.offerTask(id, user);
    }
    if (type == 'coupon') {
      return await this.couponTask(id, user);
    }
    throw new NotFoundException('Invalid Tracking type');
  }

  private async brandTask(id: string, user: string) {
    const userInfo = await this.userModel.findOne({ _id: user });
    const brand = await this.brandModel.findOne({ _id: id });
    if (!brand || !userInfo) {
      throw new NotFoundException('Brand Not Found');
    }

    await brand.updateOne({ clicks: brand.clicks + 1 });
    const link = `${brand.linkUrl}&subid=${userInfo._id}&subid1=${brand.stockISIN}&subid2=brand&subid3=${
      brand._id
    }&subid4=${JSON.stringify({
      name: userInfo.name,
      userId: userInfo._id,
      type: 'offer',
      docId: brand._id,
      brand: brand._id,
      stock: brand.stockISIN,
    })}`;
    //==== Add LOG ====
    await this.logService.createNewLog({
      title: `${userInfo.name} click a brand - ${brand.name}`,
      type: LogType.CLICK_ACTIVITY,
      user: userInfo._id.toString(),
      data: {
        link,
        brand,
      },
      description: `user  redirect to target page`,
    });
    //==================
    return link;
  }

  private async offerTask(id: string, user: string) {
    const userInfo = await this.userModel.findOne({ _id: user });
    const offer = await this.offerModel.findOne({ _id: id });
    if (!offer || !userInfo) {
      throw new NotFoundException('Brand Not Found');
    }

    await offer.updateOne({ clicks: offer.clicks + 1 });
    const link = `${offer.link}&subid=${userInfo._id}&subid1=${offer.stockISIN}&subid2=offer&subid3=${
      offer._id
    }&subid4=${JSON.stringify({
      name: userInfo.name,
      userId: userInfo._id,
      type: 'offer',
      docId: offer._id,
      brand: offer.brandId,
      stock: offer.stockISIN,
    })}`;
    //==== Add LOG ====
    await this.logService.createNewLog({
      title: `${userInfo.name} click a offer - ${offer.offerTitle}`,
      type: LogType.CLICK_ACTIVITY,
      user: userInfo._id.toString(),
      data: {
        link,
        offer,
      },
      description: `user redirect to target page`,
    });
    //==================
    return link;
  }

  private async couponTask(id: string, user: string) {
    const userInfo = await this.userModel.findOne({ _id: user });
    const coupon = await this.couponModel.findOne({ _id: id });
    if (!coupon || !userInfo) {
      throw new NotFoundException('Brand Not Found');
    }

    await coupon.updateOne({ clicks: coupon.clicks + 1 });
    const link = `${coupon.link}&subid=${userInfo._id}&subid1=${coupon.stockISIN}&subid2=coupon&subid3=${
      coupon._id
    }&subid4=${JSON.stringify({
      name: userInfo.name,
      userId: userInfo._id,
      type: 'coupon',
      docId: coupon._id,
      brand: coupon.brandId,
      stock: coupon.stockISIN,
    })}`;
    //==== Add LOG ====
    await this.logService.createNewLog({
      title: `${userInfo.name} click a offer - ${coupon.couponTitle}`,
      type: LogType.CLICK_ACTIVITY,
      user: userInfo._id.toString(),
      data: {
        link,
        coupon,
      },
      description: `user redirect to target page`,
    });
    //==================
    return link;
  }
}
