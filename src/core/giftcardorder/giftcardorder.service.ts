import { WhoowService } from './../whoow/whoow.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashFreeService } from 'src/global/cash-free/cash-free.service';
import { LogService } from 'src/global/log/log.service';
import { VouchagramService } from 'src/processer/task/vouchagram/vouchagram.service';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import {
  GiftCardErrors,
  GiftCardErrorsDocument,
} from 'src/schemas/payment/errorcards.schema';

import { User, UserDocument } from 'src/schemas/user.schema';
import {
  VouchagramBrands,
  VouchagramBrandsDocument,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';
import {
  MyGiftCards,
  MyGiftCardsDocument,
} from '../../schemas/payment/cards.schema';
import { CreateGifterDto } from './dto/CreateGifter.dto';
import {
  GiftCardPayments,
  GiftCardPaymentsDocument,
} from 'src/schemas/payment/paymentorders.schema';
import { WhooCard, WhoohCardDocument } from 'src/schemas/whoohcards.schema';
import { WhoowApiService } from 'src/processer/task/whoow/whoow.service';
import { dataTagSymbol } from '@tanstack/react-query';

@Injectable()
export class GiftcardorderService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(MyGiftCards.name)
    private readonly myGiftCardsModel: Model<MyGiftCardsDocument>,

    @InjectModel(GiftCardPayments.name)
    private readonly giftCardPaymentsModel: Model<GiftCardPaymentsDocument>,

    @InjectModel(GiftCardErrors.name)
    private readonly giftCardErrorsModel: Model<GiftCardErrorsDocument>,

    @InjectModel(VouchagramBrands.name)
    private readonly vouchagramBrandsModel: Model<VouchagramBrandsDocument>,

    @InjectModel(WhooCard.name)
    private readonly whoowModel: Model<WhoohCardDocument>,

    private readonly vouchagramService: VouchagramService,
    private readonly logService: LogService,
    private readonly cashFreeService: CashFreeService,
    private readonly whoowApiService: WhoowApiService,
  ) {}

  async createGifter(createGiftcardorderDto: CreateGifterDto) {
    const findProduct = await this.vouchagramBrandsModel
      .findOne({
        brandProductCode: createGiftcardorderDto.brandProductCode,
      })
      .lean();

    if (!findProduct) {
      throw new NotFoundException('Gift Card not found');
    }

    // Find the user based on the user ID
    const userData = await this.userModel.findOne({
      _id: createGiftcardorderDto.user,
    });
    if (!userData) {
      throw new NotAcceptableException('User not found');
    }

    const stocks = await this.vouchagramService.getStocks(
      createGiftcardorderDto.brandProductCode,
      createGiftcardorderDto.denomination,
    );

    if (stocks.AvailableQuantity < 0) {
      throw new BadRequestException('Sorry, out of stock');
    }

    // create A Payment
    const payment = await this.giftCardPaymentsModel.create({
      user: createGiftcardorderDto.user,
      amount: createGiftcardorderDto.payAmount,
      data: createGiftcardorderDto,
      item: 'GIFTER',
      metaData: findProduct,
    });

    const session = await this.cashFreeService.createSession({
      order_amount: createGiftcardorderDto.payAmount,
      order_id: payment._id.toString(),
      order_note: 'Pay For Gifter',
      order_currency: 'INR',
      customer_details: {
        customer_email: userData.email,
        customer_id: userData._id.toString(),
        customer_name: userData.name,
        customer_phone: userData.mobile.toString(),
      },
    });

    const sessionData = await payment.updateOne({
      paymentResponse: session,
      sessionID: session.payment_session_id,
    });

    return await this.giftCardPaymentsModel.findById(payment._id);
  }
  // On Retry Just Recall This Function Its Works FOrt GIFTRER ONLY
  async completeGifterOrder(paymentID: string, tryAgain?: false) {
    const payment = await this.giftCardPaymentsModel.findById({
      _id: paymentID,
    });

    if (!payment) {
      throw new NotFoundException('Order not found');
    }
    const verify = await this.cashFreeService.verifyPayment(paymentID);

    await payment.updateOne({
      paymentResponse: verify,
    });

    if (verify.order_status !== 'PAID') {
      throw new NotAcceptableException(
        'Payment Not Complete! Please Try Again',
      );
    }

    await payment.updateOne({
      status: 'COMPLETE',
    });

    const { status, data, message } = await this.vouchagramService.pullVouchers(
      {
        BrandProductCode: payment.data.brandProductCode,
        Denomination: payment.data.denomination,
        Quantity: 1,
        ExternalOrderId: paymentID,
        user: payment.user.toString(),
        paymentId: paymentID,
      },
      tryAgain,
    );

    if (!status) {
      throw new NotImplementedException(message);
    }

    const pullVoucher = data;
    const voucherData = pullVoucher?.PullVouchers[0];

    const isGiftCardExist = await this.myGiftCardsModel.findOne({
      user: payment.user,
      paymentID: payment._id,
      amount: payment.data.denomination,
    });

    const newVoucherData = {
      user: payment.user,
      paymentID: payment._id,
      amount: payment.data.denomination,
      provider: 'GIFTER',
      code: voucherData.Vouchers[0].VoucherGCcode,
      pin: voucherData.Vouchers[0].Voucherpin,
      expiredDate: voucherData.Vouchers[0].EndDate,
      gifterResponse: pullVoucher,
      name: voucherData.VoucherName,
    };

    let resData = isGiftCardExist;
    if (isGiftCardExist) {
      await isGiftCardExist.updateOne(newVoucherData);
    } else {
      resData = await this.myGiftCardsModel.create(newVoucherData);
    }

    const voucherDataRes = await this.myGiftCardsModel.findById({
      _id: resData._id,
    });

    return voucherDataRes;
  }

  async createWhoow(createGiftcardorderDto: CreateGifterDto) {
    const product = await this.whoowModel.findOne({
      'data.sku': createGiftcardorderDto.brandProductCode,
    });

    if (!product) {
      throw new NotFoundException('Gift Card not found');
    }

    const userData = await this.userModel.findOne({
      _id: createGiftcardorderDto.user,
    });

    if (!userData) {
      throw new NotAcceptableException('User not found');
    }

    const payment = await this.giftCardPaymentsModel.create({
      user: createGiftcardorderDto.user,
      amount: createGiftcardorderDto.payAmount,
      item: 'WHOOW',
      data: createGiftcardorderDto,
      metaData: product,
    });

    const session = await this.cashFreeService.createSession({
      order_amount: createGiftcardorderDto.payAmount,
      order_id: payment._id.toString(),
      order_note: 'Pay For Gifter',
      order_currency: 'INR',
      customer_details: {
        customer_email: userData.email,
        customer_id: userData._id.toString(),
        customer_name: userData.name,
        customer_phone: userData.mobile.toString(),
      },
    });

    await payment.updateOne({
      paymentResponse: session,
      sessionID: session.payment_session_id,
    });

    return await this.giftCardPaymentsModel.findById(payment._id);
  }

  async completeWhoowOrder(paymentID: string) {
    const payment = await this.giftCardPaymentsModel.findById({
      _id: paymentID,
    });

    if (!payment) {
      throw new NotFoundException('Order not found');
    }

    const userData = await this.userModel.findById({
      _id: payment.user,
    });

    const verify = await this.cashFreeService.verifyPayment(paymentID);

    await payment.updateOne({
      paymentResponse: verify,
    });

    if (verify.order_status !== 'PAID') {
      throw new NotAcceptableException(
        'Payment Not Complete! Please Try Again',
      );
    }

    await payment.updateOne({
      paymentResponse: verify,
      status: 'COMPLETE',
    });

    // for Create One Time Only
    const isErrorExist = await this.giftCardErrorsModel.findOne({
      paymentID: payment._id,
    });

    try {
      const pullVoucher = await this.whoowApiService.createOrder({
        amount: payment.data.denomination,
        id: payment._id.toString(),
        sku: payment.data.brandProductCode,
        user: userData,
        upi: 'test@pnb',
      });

      if (pullVoucher.status == 'PROCESSING') {
        if (!isErrorExist) {
          await this.giftCardErrorsModel.create({
            user: payment.user.toString(),
            amount: payment.data.denomination,
            paymentID: payment._id,
            provider: 'WHOOW',
            errorResponse: pullVoucher,
          });
        }
        return {
          status: false,
          message: 'Your Order is Under Processing',
          data: pullVoucher,
        };
      }

      if (pullVoucher?.status == 'COMPLETE') {
        const voucherData = pullVoucher?.data?.cards[0];
        const voucher = await this.myGiftCardsModel.create({
          user: payment.user,
          paymentID: payment._id,
          amount: payment.data.denomination,
          provider: 'WHOOW',
          code: voucherData.cardNumber,
          pin: voucherData.cardPin,
          expiredDate: voucherData.validity,
          whoowResponse: pullVoucher,
          name: voucherData.productName,
        });

        return {
          status: true,
          message: 'Gift Card Create Successfully',
          data: voucher,
        };
      }

      // For Unknown
      if (!isErrorExist) {
        await this.giftCardErrorsModel.create({
          user: payment.user.toString(),
          amount: payment.data.denomination,
          paymentID: payment._id,
          provider: 'WHOOW',
          errorResponse: pullVoucher,
        });
      }
      return {
        status: false,
        message: 'Your Order is ' + pullVoucher?.status,
        data: pullVoucher,
      };
    } catch (error) {
      if (!isErrorExist) {
        await this.giftCardErrorsModel.create({
          user: payment.user.toString(),
          amount: payment.data.denomination,
          paymentID: payment._id,
          provider: 'WHOOW',
          errorResponse: error?.response?.data || 'Unknown Error',
        });
      }
      return {
        status: false,
        message:
          error?.response?.data?.message || 'Error On Processing Your Request.',
        errorResponse: error?.response?.data || 'Unknown Error',
      };
    }
  }
}
