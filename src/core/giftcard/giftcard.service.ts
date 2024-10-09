import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GiftCard, GiftCardDocument } from 'src/schemas/giftcard.schema';

import { CreateGiftCardDto, UpdateGiftCardDto } from './giftcard.dto';
import {
  VouchagramBrands,
  VouchagramBrandsDocument,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';

import {
  VouchagramStores,
  VouchagramStoresDocument,
} from 'src/schemas/vouchagram/vouchagramStores.schema';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { VouchagramService } from 'src/processer/task/vouchagram/vouchagram.service';
import { UserDto } from '../user/dto/user.dto';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LogService } from 'src/global/log/log.service';

@Injectable()
export class GiftcardService {
  private cahFreeApi = 'https://sandbox.cashfree.com';
  private cashFreeClientID = 'TEST102842697ad690418252d855b7f996248201';
  private cashFreeClientSecret =
    'cfsk_ma_test_68d82df1eb052f21339a5295bff9841d_9eb0f511';

  private cashFreeHeader = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': this.cashFreeClientID,
    'x-client-secret': this.cashFreeClientSecret,
  };
  constructor(
    @InjectModel(GiftCard.name)
    private readonly giftCardModel: Model<GiftCardDocument>,
    @InjectModel(VouchagramBrands.name)
    private readonly vouchagramBrandsModel: Model<VouchagramBrandsDocument>,
    @InjectModel(VouchagramStores.name)
    private readonly VouchagramStoresModel: Model<VouchagramStoresDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly vouchagramService: VouchagramService,
    private readonly httpService: HttpService,
    private readonly logService: LogService,
  ) {}

  async getGites(type: string) {
    if (type == 'stores') {
      return await this.VouchagramStoresModel.find();
    }
    return await this.vouchagramBrandsModel.find();
  }

  async getGiteId(type: string, id: string) {
    if (type == 'stores') {
      return await this.VouchagramStoresModel.findOne({ _id: id });
    }
    return await this.vouchagramBrandsModel.findOne({ _id: id });
  }

  async createGiftCard(data: CreateGiftCardDto, image: Express.Multer.File) {
    const task = await this.giftCardModel.create({
      ...data,
      GiftCardImage: image.path,
      data: JSON.parse(data.data.toString()),
    });
    return {
      status: true,
      message: 'gift card create successfully',
      data: task,
    };
  }

  async updateGiftCard(
    id: string,
    data: UpdateGiftCardDto,
    image?: Express.Multer.File,
  ) {
    const exist = await this.giftCardModel.findOne({ _id: id });

    if (!exist) {
      throw new NotFoundException('Gift card not found');
    }

    if (image) {
      data = {
        ...data,
        GiftCardImage: image.path,
      };
    }
    data.data = JSON.parse(data.data.toString());

    const task = await this.giftCardModel.updateOne({ _id: id }, data);
    return {
      status: true,
      message: 'gift card update successfully',
      data: task,
    };
  }

  async deleteGiftCard(id: string) {
    const task = await this.giftCardModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'gift card delete successfully',
      data: task,
    };
  }

  async getGiftCard(id: string) {
    let task: any = await this.giftCardModel.findOne({ _id: id }).lean();
    if (!task) {
      throw new NotFoundException('Sorry Gift Card Not Found');
    }
    const brand = await this.brandModel.findById(task.brandId).lean();

    return {
      ...task,
      brand,
    };
  }

  async getAllGiftCard() {
    const task = await this.giftCardModel.aggregate([
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: '$brand',
      },
    ]);
    return task;
  }

  async getActiveGiftCard() {
    const task = await this.giftCardModel.aggregate([
      { $match: { isEnable: true } },
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: '$brand',
      },
    ]);
    return task;
  }

  async checkStocks(BrandProductCode: string, Denomination: number) {
    return await this.vouchagramService.getStocks(
      BrandProductCode,
      Denomination,
    );
  }

  async createPaymentSession(
    BrandProductCode: string,
    Denomination: number,
    data: { payAmount: number; user: string },
  ) {
    const findProduct = await this.vouchagramBrandsModel
      .findOne({
        brandProductCode: BrandProductCode,
      })
      .lean();

    if (!findProduct) {
      throw new NotFoundException('Gift Card not found');
    }

    // Find the user based on the user ID
    const userData = await this.userModel.findOne({ _id: data.user });
    if (!userData) {
      throw new NotAcceptableException('User not found');
    }

    // Check stock availability
    const stock = await this.checkStocks(BrandProductCode, Denomination);
    if (stock.AvailableQuantity < 0) {
      throw new BadRequestException('Sorry, out of stock');
    }

    // Create a payment document
    const paymentDoc = await this.paymentModel.create({
      amount: data.payAmount,
      brandProductCode: BrandProductCode,
      user: userData._id,
      denomination: Denomination,
      itemData: findProduct,
    });

    try {
      // Make an HTTP request to create the payment session
      const reqPaymentSession = await this.httpService.axiosRef.post(
        this.cahFreeApi + '/pg/orders',
        {
          order_id: paymentDoc._id,
          order_amount: data.payAmount,
          order_currency: 'INR',
          order_note: 'gift card payment',
          customer_details: {
            customer_id: userData._id,
            customer_name: userData.name,
            customer_email: userData.email,
            customer_phone: userData.mobile.toString(),
          },
        },
        {
          headers: this.cashFreeHeader,
        },
      );

      // Update the payment document with the payment session data
      paymentDoc.data = reqPaymentSession.data;
      await paymentDoc.save();

      // Return the session data
      return reqPaymentSession.data;
    } catch (error: any) {
      // Log the error properly
      console.error(
        'Payment session creation failed:',
        error?.response?.data || error.message,
      );

      throw new BadRequestException(
        'Payment session creation failed. Please try again.',
      );
    }
  }

  async verifyPayment(id: string) {
    try {
      const existOrder = await this.paymentModel.findOne({ _id: id }).lean();

      if (!existOrder) {
        throw new NotFoundException('Order not found');
      }
      // Make an HTTP request to create the payment session
      const reqPaymentVerify = await this.httpService.axiosRef.get(
        this.cahFreeApi + '/pg/orders/' + id,
        {
          headers: this.cashFreeHeader,
        },
      );

      // Update the payment document with the payment session data
      // paymentDoc.data = reqPaymentVerify.data;
      // await paymentDoc.save();
      await this.paymentModel.updateOne(
        { _id: id },
        {
          status: reqPaymentVerify.data.order_status,
          data: reqPaymentVerify.data,
        },
      );
      const findOrder = await this.paymentModel.findOne({ _id: id }).lean();

      if (reqPaymentVerify.data.order_status === 'PAID') {
        if (findOrder.completePurchase == false) {
          const pullVoucher = await this.vouchagramService.pullVouchers({
            BrandProductCode: findOrder.brandProductCode,
            Denomination: findOrder.denomination,
            Quantity: 1,
            ExternalOrderId: id,
          });
          try {
            await this.logService.createNewLog({
              type: 'Gift Card',
              description: `Voucher pulled successfully`,
              user: findOrder.user.toString(),
              data: pullVoucher,
              title: 'Purchase Gift Card',
            });
          } catch (error) {
            console.log(error);
          }
          await this.paymentModel.updateOne(
            { _id: id },
            {
              completePurchase: true,
              giftCard: pullVoucher,
            },
          );
        }
      }
      // Return the session data
      const finalOrder = await this.paymentModel.findOne({ _id: id }).lean();

      return finalOrder;
    } catch (error: any) {
      // Log the error properly
      console.error(
        'Payment verification failed:',
        error?.response?.data || error.message,
      );

      throw new BadRequestException(
        'Payment verification failed. Please try again.',
      );
    }
  }

  async getGiftCardCode(id: string) {
    let task: any = await this.paymentModel.findOne({ _id: id }).lean();
    if (!task) {
      throw new NotFoundException('Sorry Gift Card Not Found');
    }
    const brand = await this.brandModel.findById(task.brandId).lean();
    return {
      ...task,
      brand,
    };
  }

  async getMyGiftCardCodes(id: string) {
    let task: any = await this.paymentModel
      .find({ user: id, status: 'PAID', completePurchase: true })
      .sort({ createdAt: -1 })
      .lean();
    return task;
  }
}
