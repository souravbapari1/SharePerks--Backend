import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AdminService } from 'src/core/auth/admin/admin.service';
import { TransitionService } from 'src/core/transition/transition.service';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Coupon, CouponDocument } from 'src/schemas/coupons.schema';
import { Offers, OffersDocument } from 'src/schemas/offers.schema';
import { ObjectId } from 'bson';

import {
  Transitions,
  TransitionsDocument,
} from 'src/schemas/transitions.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AdmitadService } from '../admitad/admitad.service';
import { TransitionsType } from 'src/constants/constents';
import {
  CueLinkTransitions,
  Transaction,
  TransitionsData,
} from '../cuelinks/cuelinks';
import { AdmitedTransions } from '../admitad/admitad';
import { CuelinksService } from '../cuelinks/cuelinks.service';
import { Holdings, HoldingsDocument } from 'src/schemas/holdings.schema';
import { NotificationService } from 'src/global/notification/notification.service';

@Injectable()
export class CommitionService {
  /**
   * This service is responsible for tracking the commision data from Admitad, Cuelinks and Vouchagram
   * It fetches the data from the respective APIs and stores it in the Transitions collection
   * It also updates the user's balance and logs the transaction
   * @constructor
   */
  constructor(
    /**
     * Transition service to log the transitions
     */
    private readonly transitionService: TransitionService,

    private readonly notificationService: NotificationService,

    /**
     * Admitad service to fetch data from Admitad
     */
    private readonly admitedService: AdmitadService,

    /**
     * Cuelinks service to fetch data from Cuelinks
     */
    private readonly cuelinksService: CuelinksService,

    /**
     * User model to find the user
     */
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    /**
     * Brand model to find the brand
     */
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,

    @InjectModel(Holdings.name)
    private readonly holdingsModel: Model<HoldingsDocument>,
    /**
     * Offers model to find the offer
     */
    @InjectModel(Offers.name)
    private readonly offersModel: Model<OffersDocument>,

    /**
     * Coupon model to find the coupon
     */
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    /**
     * Transitions model to store the transitions
     */
    @InjectModel(Transitions.name)
    private readonly transitionsModel: Model<TransitionsDocument>,
  ) { }

  /**
   * This method is responsible for fetching the data from Admitad and storing it in the Transitions collection
   */
  async trackAdmitedUpdateProcess() {
    const transitionsData =
      await this.admitedService.getActionStatisticsForLast30Days();

    if (transitionsData) {
      transitionsData.forEach(async (transition) => {
        const user = transition.userId;
        const type = transition.type;
        const typeDocId = transition.typeId;
        const provider = transition.provider;
        const status = transition.status;
        const communionId = transition.provider_id;

        const findUser = await this.userModel.findById(user);
        if (!findUser) {
          throw new NotFoundException('User Not Found this ID');
        }

        const transitions = await this.transitionsModel.findOne({
          transitions_id: communionId,
          user: user,
          type: type,
        });

        if (transitions) {
          await this.transitionsModel.updateOne(
            { _id: transitions._id },
            {
              $set: {
                status: transition.status,
              },
            },
          );
          if (transitions.status.toLowerCase() == 'approved') {
            // update task Here
            await this.transferMoney({
              tDocID: transitions._id.toString(),
              type: transition.type,
              typeDocId: transition.typeId,
              user,
            });
          }
        } else {
          await this.newCommunion(transition);
        }
      });
    }
  }

  /**
   * This method is responsible for fetching the data from Cuelinks and storing it in the Transitions collection
   */
  async trackCuelinksUpdateProcess() {
    const transitionsData =
      await this.cuelinksService.getLast30DaysTransactions();
    if (transitionsData) {
      transitionsData.forEach(async (transition) => {
        try {
          const user = transition.userId;

          const type = transition.type;
          const typeDocId = transition.typeId;
          const provider = transition.provider;
          const status = transition.status;
          const communionId = transition.provider_id;

          try {
            const findUser = await this.userModel.findById(user);
            if (!findUser) {
              throw new NotFoundException('User Not Found this ID');
            }
          } catch (error) {
            throw new NotFoundException('User Not Found this ID');
          }

          const transitions = await this.transitionsModel.findOne({
            transitions_id: communionId,
            user: new mongoose.Types.ObjectId(user),
          });

          if (transitions) {
            await this.transitionsModel.updateOne(
              { _id: transitions._id },
              {
                $set: {
                  status: transition.status,

                },
              },
            );
            if (transitions.status.toLowerCase() == 'payable') {
              // update task Here [x]
              await this.transferMoney({
                tDocID: transitions._id.toString(),
                type: transition.type,
                typeDocId: transition.typeId,
                user,
              });
            }
          } else {
            await this.newCommunion(transition);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  /**
   * This method is responsible for creating a new communion in the Transitions collection
   * @param transition The transition data
   */
  private async newCommunion(
    transition: TransitionsData<AdmitedTransions | Transaction>,
  ) {
    const user = transition.userId;

    const type = transition.type as 'brand' | 'coupon' | 'offer';
    const typeDocId = transition.typeId;
    // const typeDocId = '67a2f503b0eb90fbd18caa7a';

    const status = transition.status;
    const communionId = transition.provider_id;

    const tracking = await this.getCommunionTypeOrderExist(type, typeDocId);

    const commission = await this.getCommissionRate({
      type,
      typeDocId,
      user,
      amount: transition.amount,
    });

    await this.transitionService.createUserTransition({
      amount: transition.amount,
      data: transition,
      status: status,
      type: TransitionsType.COMMOTION,
      payAmount: commission,
      user: user,
      brand: tracking.brand.toString(),
      title: transition.store_name,
      subtitle: 'Commotion Received from ' + transition.store_name,
      completePayment: false,
      typeDocId: typeDocId,
      transitions_id: communionId,
      providerCommotion: transition.commission,
    });
    console.log(transition.commission);

    try {
      this.notificationService.sendNotificationQuickUser({
        id: user,
        message: 'You have received a commotion from ' + transition.store_name,
        title: 'Commotion Received',
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * This method is responsible for finding the brand or offer or coupon based on the type and typeDocId
   * @param type The type of the transition
   * @param typeDocId The id of the document
   */
  private async getCommunionTypeOrderExist(type: string, typeDocId: string) {
    if (type == 'brand') {
      const brand = await this.brandModel.findOne({ _id: typeDocId });
      if (!brand) {
        throw new NotFoundException('Brand Not Found');
      }

      return {
        brand: brand._id,
        data: brand,
      };
    }

    if (type == 'coupon') {
      const coupon = await this.couponModel.findOne({ _id: typeDocId });
      if (!coupon) {
        throw new NotFoundException('Coupon Not Found');
      }

      return {
        brand: coupon.brandId,
        data: coupon,
      };
    }

    if (type == 'offer') {
      const offer = await this.offersModel.findOne({ _id: typeDocId });
      if (!offer) {
        throw new NotFoundException('Offer Not Found');
      }

      return {
        brand: offer.brandId,
        data: offer,
      };
    }

    throw new NotFoundException('Invalid Tracking type');
  }

  public async transferMoney({
    tDocID,
    type,
    typeDocId,
    user,
  }: {
    user: string;
    type: string;
    typeDocId: string;
    tDocID: string;
  }) {
    const check = await this.transitionsModel.findOne({
      _id: tDocID,
    });

    if (check.completePayment == true) {
      return;
    }

    const commission = await this.getCommissionRate({
      type,
      typeDocId,
      user,
      amount: check.amount,
    });

    if (check.completePayment == false) {
      await this.userModel.findOneAndUpdate(
        { _id: user },
        {
          $inc: {
            walletAmount: commission,
          },
        },
      );
      await this.transitionsModel.findOneAndUpdate(
        { _id: tDocID },
        {
          $set: {
            completePayment: true,
            payoutStatus: 'SUCCESS',
            payAmount: commission,
          },
        },
      );
    }
  }

  public calculatePercentage(amount: number, percentage: number): number {
    return (amount * percentage) / 100;
  }

  public async getCommissionRate({
    type,
    typeDocId,
    user,
    amount,
  }: {
    user: string;
    type: string;
    typeDocId: string;
    amount: number;
  }) {
    const orderItem = await this.getCommunionTypeOrderExist(type, typeDocId);
    const commotionType = orderItem.data.commissionType;
    const basicRate = orderItem.data.commissionRate;
    const withHoldingRate = (orderItem.data as any).commissionRateWithHolding;
    const STOCK = orderItem.data.stockISIN;

    let availableStock = false;

    console.log({
      type,
      typeDocId,
      commotionType,
      basicRate,
      withHoldingRate,
      STOCK,
      availableStock,

      amount,
    });

    const userData = await this.userModel.findOne({ _id: user });
    if (userData.brokerConnected == true) {
      const holdings = await this.holdingsModel.findOne({ user: user });

      if (holdings) {
        const stock = holdings.data.securities.find(
          (e: any) => e.isin == STOCK,
        );
        if (stock) {
          availableStock = stock.available;
        }
      }
    }

    let commission = 0;

    if (commotionType == 'AMOUNT') {
      commission = availableStock ? withHoldingRate : basicRate;
    } else {
      commission = availableStock
        ? this.calculatePercentage(amount, withHoldingRate)
        : this.calculatePercentage(amount, basicRate);
    }
    return commission;
  }
}
