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

@Injectable()
export class CommitionService {
  constructor(
    private readonly transitionService: TransitionService,
    private readonly admitedService: AdmitadService,
    private readonly cuelinksService: CuelinksService,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,

    @InjectModel(Offers.name)
    private readonly offersModel: Model<OffersDocument>,

    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    @InjectModel(Transitions.name)
    private readonly transitionsModel: Model<TransitionsDocument>,
  ) {}

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

        if (transition) {
          // update task Here
        } else {
          await this.newCommunion(transition);
        }
      });
    }
  }

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
            user: user,
            type: type,
          });

          if (transitions) {
            // update task Here
          } else {
            await this.newCommunion(transition);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  }

  private async newCommunion(
    transition: TransitionsData<AdmitedTransions | Transaction>,
  ) {
    const user = transition.userId;
    const type = transition.type as 'brand' | 'coupon' | 'offer';
    const typeDocId = transition.typeId;

    const status = transition.status;
    const communionId = transition.provider_id;

    const tracking = await this.getCommunionTypeOrderExist(type, typeDocId);

    await this.transitionService.createUserTransition({
      amount:
        transition.provider == 'cuelinks'
          ? transition.commission
          : transition.amount,
      data: transition,
      status: status,
      type: TransitionsType.COMMOTION,
      user: user,
      brand: tracking.brand.toString(),
      title: transition.store_name,
      subtitle: 'Commotion Received from ' + transition.store_name,
      completePayment: false,
      typeDocId: typeDocId,
      transitions_id: communionId,
    });
  }

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
}
