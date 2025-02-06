import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransitionsType } from 'src/constants/constents';
import { LogService } from 'src/global/log/log.service';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Commission } from 'src/schemas/commission.schems';
import { Coupon, CouponDocument } from 'src/schemas/coupons.schema';
import { GiftCard } from 'src/schemas/giftcard.schema';
import { Offers, OffersDocument } from 'src/schemas/offers.schema';
import { MyGiftCards } from 'src/schemas/payment/cards.schema';
import { Payout, PayoutDocument } from 'src/schemas/payouts.schema';
import {
  Transitions,
  TransitionsDocument,
} from 'src/schemas/transitions.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { WhooCard } from 'src/schemas/whoohcards.schema';

@Injectable()
export class DashbordService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
    @InjectModel(Offers.name)
    private readonly offerModel: Model<OffersDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Payout.name)
    private readonly payoutModel: Model<PayoutDocument>,

    @InjectModel(Transitions.name)
    private readonly transitionsModel: Model<TransitionsDocument>,

    @InjectModel(WhooCard.name)
    private readonly whoowCardModel: Model<WhooCard>,

    @InjectModel(GiftCard.name)
    private readonly giftCardModel: Model<GiftCard>,

    @InjectModel(MyGiftCards.name)
    private readonly myGiftCardsModel: Model<MyGiftCards>,
  ) {}

  async getStatus() {
    const totalUsers = await this.userModel.countDocuments();
    const totalSell = await this.transitionsModel.countDocuments();

    const totalPayoutPending = await this.payoutModel
      .find({ status: 'pending' })
      .countDocuments();

    const totalClicks = await this.getTotalClicks();
    const payoutPi = await this.getPayoutPi();
    const cashflow = await this.getCashFlowPi();
    const giftcards = await this.getGiftcards();
    return {
      totalUsers,
      totalClicks,
      totalPayoutPending,
      liveUsers: 0,
      totalSell: totalSell,
      totalCommission: cashflow.in,
      payoutPi: payoutPi,
      giftcards,
      inOutPi: {
        in: cashflow.in,
        out: cashflow.out,
      },
    };
  }

  private async getTotalClicks() {
    const brandsClicks = await this.brandModel.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
        },
      },
    ]);

    const offersClicks = await this.offerModel.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
        },
      },
    ]);

    const couponClicks = await this.couponModel.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$clicks' },
        },
      },
    ]);

    return (
      (couponClicks[0]?.totalClicks || 0) +
      (offersClicks[0]?.totalClicks || 0) +
      (brandsClicks[0]?.totalClicks || 0)
    );
  }

  private async getPayoutPi() {
    const pending = await this.payoutModel
      .find({ status: 'pending' })
      .countDocuments();
    const complete = await this.payoutModel
      .find({ status: 'complete' })
      .countDocuments();
    const cancel = await this.payoutModel
      .find({ status: 'cancel' })
      .countDocuments();
    const failed = await this.payoutModel
      .find({ status: 'failed' })
      .countDocuments();

    return {
      pending,
      cancel,
      complete,
      failed,
    };
  }

  private async getCashFlowPi() {
    const completeCommotion = await this.transitionsModel.find({
      completePayment: true,
      type: TransitionsType.COMMOTION,
    });

    const cashOut = await this.payoutModel.find({
      status: 'complete',
    });

    return {
      in: completeCommotion.reduce((sum, item) => sum + item.amount, 0),
      out: cashOut.reduce((sum, item) => sum + item.amount, 0),
    };
  }

  public async getGiftcards() {
    const gifterGiftCards = await this.giftCardModel.find();
    const whoowGiftCards = await this.whoowCardModel.find();
    const myGiftCards = await this.myGiftCardsModel.find();

    return {
      gifter: gifterGiftCards.length,
      whoow: whoowGiftCards.length,
      sucessOrders: myGiftCards.length,
    };
  }
}
