import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWhoowDto } from './dto/create-whoow.dto';
import { UpdateWhoowDto } from './dto/update-whoow.dto';
import { Model } from 'mongoose';

import { WhooCard, WhoohCardDocument } from 'src/schemas/whoohcards.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { CreateWhoowPaymentSessionDto } from './dto/payment-session.dto';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import { GiftCard } from 'src/schemas/giftcard.schema';
import { GiftcardService } from '../giftcard/giftcard.service';
import { HttpService } from '@nestjs/axios';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LogService } from 'src/global/log/log.service';
import { WhoowApiService } from 'src/processer/task/whoow/whoow.service';

@Injectable()
export class WhoowService {
  constructor(
    @InjectModel(WhooCard.name)
    private readonly whoowModel: Model<WhoohCardDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly giftCardService: GiftcardService,
    private readonly logService: LogService,
    private readonly httpService: HttpService,
    private readonly whoowApiService: WhoowApiService,
  ) {}

  async create(createWhoowDto: CreateWhoowDto, file: Express.Multer.File) {
    const brand = await this.brandModel.findById(createWhoowDto.brandId);
    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }

    const res = await this.whoowModel.create({
      ...createWhoowDto,
      GiftCardImage: file.path,
    });

    return {
      message: 'Gift Card Create Successfully',
      status: true,
      data: res,
    };
  }

  async findAll() {
    return await this.whoowModel.aggregate([
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  async findAllActive() {
    return await this.whoowModel.aggregate([
      {
        $match: {
          isEnable: true,
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  async findOne(id: string) {
    let card = await this.whoowModel.findById(id).lean();
    let brand = await this.brandModel.findById(card.brandId);

    return { ...card, brand };
  }

  async update(
    id: string,
    updateWhoowDto: UpdateWhoowDto,
    file?: Express.Multer.File,
  ) {
    if (updateWhoowDto.brandId) {
      const brand = await this.brandModel.findById(updateWhoowDto.brandId);
      if (!brand) {
        throw new NotFoundException('Brand Not Found');
      }
    }
    let data = updateWhoowDto;

    if (file) {
      data = {
        ...data,
        GiftCardImage: file.path,
      };
    }

    const res = await this.whoowModel.updateOne({ _id: id }, data);

    return {
      status: true,
      message: 'GiftCard Update successfully',
      data: res,
    };
  }

  async remove(id: string) {
    const res = await this.whoowModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'GiftCard Delete successfully',
      data: res,
    };
  }

  async createPaymentSession(user: string, data: CreateWhoowPaymentSessionDto) {
    const product = await this.whoowModel.findById(data.productId);
    const paymentDoc = await this.paymentModel.create({
      amount: data.amount,
      brandProductCode: product.data.sku,
      user: user,
      denomination: data.cardAmount.toString(),
      itemData: product,
      type: 'WhoowGiftCard',
    });

    const userData = await this.userModel.findOne({ _id: user });

    try {
      // Make an HTTP request to create the payment session
      const reqPaymentSession = await this.httpService.axiosRef.post(
        this.giftCardService.cahFreeApi + '/pg/orders',
        {
          order_id: paymentDoc._id,
          order_amount: data.amount,
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
          headers: this.giftCardService.cashFreeHeader,
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
      console.log(error);

      throw new BadRequestException(
        'Payment session creation failed. Please try again.',
      );
    }
  }

  async verifyPayment(id: string) {
    try {
      const existOrder = await this.paymentModel.findOne({ _id: id }).lean();
      console.log(existOrder);

      if (!existOrder) {
        throw new NotFoundException('Order not found');
      }
      // Make an HTTP request to create the payment session
      const reqPaymentVerify = await this.httpService.axiosRef.get(
        this.giftCardService.cahFreeApi + '/pg/orders/' + id,
        {
          headers: this.giftCardService.cashFreeHeader,
        },
      );
      console.log(reqPaymentVerify);

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
      const user = await this.userModel.findOne({ _id: findOrder.user }).lean();

      if (reqPaymentVerify.data.order_status === 'PAID') {
        if (findOrder.completePurchase == false) {
          const pullVoucher = await this.whoowApiService.createOrder({
            amount: +findOrder.denomination,
            id: findOrder._id.toString(),
            sku: findOrder.brandProductCode,
            upi: 'test@pnb',
            user,
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
        error?.response?.data?.message ||
          'Payment verification failed. Please try again.',
      );
    }
  }
}
