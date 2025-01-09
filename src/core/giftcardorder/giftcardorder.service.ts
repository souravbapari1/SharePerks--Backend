import {
  BadRequestException,
  Injectable,
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

import {
  OrderStatsusRes,
  WhoowApiService,
} from 'src/processer/task/whoow/whoow.service';
import {
  GiftCardPayments,
  GiftCardPaymentsDocument,
} from 'src/schemas/payment/paymentorders.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import {
  VouchagramBrands,
  VouchagramBrandsDocument,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';
import { WhooCard, WhoohCardDocument } from 'src/schemas/whoohcards.schema';
import {
  MyGiftCards,
  MyGiftCardsDocument,
} from '../../schemas/payment/cards.schema';
import { CreateGifterDto } from './dto/CreateGifter.dto';
import { NotificationService } from 'src/global/notification/notification.service';

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
    private readonly notificationApiService: NotificationService,
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
  async completeGifterOrder(
    paymentID: string,
    tryAgain: boolean = false,
    refund?: any,
  ) {
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
      refund,
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
    await this.notificationApiService.sendNotificationQuickUser({
      id: voucherDataRes.user,
      title: 'Thank you.',
      message: 'Your GiftCard is Successfully Generated',
    });
    return voucherDataRes;
  }

  async retryAllGifter() {
    const res = await this.giftCardErrorsModel.find({
      retry: false,
      provider: 'GIFTER',
      refund: false,
    });

    res.forEach(async (errorCheck) => {
      try {
        await this.completeGifterOrder(
          errorCheck.paymentID.toString(),
          true,
          this.refundPayment(errorCheck.paymentID),
        );
      } catch (error) {
        console.log(error?.response?.data);
      }
    });

    return res;
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

        await this.notificationApiService.sendNotificationQuickUser({
          id: payment.user,
          title: `Order Under Processing`,
          message: 'Your GiftCard is Under Processing',
        });
        console.log('Send -1');

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
        await this.notificationApiService.sendNotificationQuickUser({
          id: payment.user,
          title: 'Thank you.',
          message: 'Your GiftCard is Successfully Generated',
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
        await this.notificationApiService.sendNotificationQuickUser({
          id: payment.user,
          title: `Order Under Processing`,
          message: 'Your GiftCard is Under Processing',
        });
        console.log('Send -2');
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
        await this.notificationApiService.sendNotificationQuickUser({
          id: payment.user,
          title: `Order Under Processing`,
          message: 'Your GiftCard is Under Processing',
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

  private async retryWhoowOrder(errorId: string) {
    const errorCodes = [
      400, 5035, 5036, 5037, 5038, 5046, 5305, 5307, 5308, 5310, 5311, 5312,
      5313, 5315, 5318, 6000, 5320,
    ];

    const payment = await this.giftCardErrorsModel.findOne({
      _id: errorId,
      retry: false,
      refund: false,
      provider: 'WHOOW',
    });

    if (!payment) {
      throw new Error('Payment Not FOund');
    }
    // Check Is Alredy Exist
    const existCard = await this.myGiftCardsModel.findOne({
      paymentID: payment.paymentID,
    });

    if (existCard) {
      return existCard;
    }

    let getOrder: OrderStatsusRes;
    try {
      getOrder = await this.whoowApiService.getOrderStatus(payment.paymentID);
    } catch (error) {
      if (errorCodes.includes(error?.response?.data?.code)) {
        await this.refundPayment(payment.paymentID, error?.response?.data);
        return error?.response?.data;
      }
      console.log(error?.response?.data);

      throw new Error('Order Status Not Found');
    }
    console.log(getOrder.status);

    const paymentData = await this.giftCardPaymentsModel.findOneAndUpdate(
      { _id: payment.paymentID },
      {
        status: getOrder.status,
      },
    );

    // ,"CANCELED",""
    const pendingState = ['PENDING', 'PROCESSING'];

    if (pendingState.includes(getOrder.status)) {
      await payment.updateOne({
        errorResponse: getOrder,
      });
      // await this.notificationApiService.sendNotificationQuickUser({
      //   id: payment.user,
      //   title: `Order Under Processing`,
      //   message: 'Your GiftCard is Under Processing',
      // });
      return getOrder;
    }

    if (getOrder.status == 'COMPLETE') {
      let getOrderData = await this.whoowApiService.getActiveOrders(
        getOrder.orderId,
      );

      // return getOrderData;
      const card = await this.myGiftCardsModel.create({
        user: payment.user,
        amount: payment.amount,
        provider: 'WHOOW',
        paymentID: payment.paymentID,
        name: getOrderData.cards[0].productName,
        code: getOrderData.cards[0].cardNumber,
        pin: getOrderData.cards[0].cardPin,
        expiredDate: getOrderData.cards[0].validity,
        whoowResponse: getOrderData,
      });
      await payment.deleteOne();
      await paymentData.updateOne({
        status: 'COMPLETE',
      });
      await this.notificationApiService.sendNotificationQuickUser({
        id: payment.user,
        title: 'Thank you.',
        message: 'Your GiftCard is Successfully Generated',
      });
      return card;
    }

    // not any other state Ex Cancel
    await payment.updateOne({
      retry: true,
      errorResponse: getOrder,
    });
    await this.refundPayment(payment.paymentID, getOrder);
    return getOrder;
  }

  private async refundPayment(payId: string, error?: any) {
    try {
      const paymentData = await this.giftCardPaymentsModel.findOne({
        _id: payId,
      });
      const payRes = await this.cashFreeService.refund(payId, {
        refund_amount: paymentData.amount,
        refund_id: payId,
        refund_note: 'Refund For Order Not Found',
        refund_speed: 'STANDARD',
      });
      await this.giftCardErrorsModel.updateOne(
        { paymentID: payId },
        {
          retry: true,
          refund: true,
          refundNote: 'Refund For Order Not Found',
          errorResponse: error,
        },
      );
      await paymentData.updateOne({
        status: 'REFUND',
      });
      await this.notificationApiService.sendNotificationQuickUser({
        id: paymentData.user,
        title: `GiftCard Generate Failed`,
        message: 'Your GiftCard is Failed. Payment Refund Successfully',
      });
      return payRes;
    } catch (error) {
      throw new NotAcceptableException('Error ON Refund');
    }
  }

  async retryAllWhoowErrors() {
    const res = await this.giftCardErrorsModel.find({
      retry: false,
      provider: 'WHOOW',
      refund: false,
    });

    res.forEach(async (errorCheck) => {
      try {
        await this.retryWhoowOrder(errorCheck._id.toString());
      } catch (error) {
        console.log(error?.response?.data);
      }
    });

    return res;
  }

  // here get My Cards
  async getMyCards(userId: string) {
    const cards = await this.myGiftCardsModel.find({
      user: userId,
    });

    const pending = await this.giftCardErrorsModel.find({
      retry: false,
      refund: false,
      user: userId,
    });

    const failed = await this.giftCardErrorsModel.find({
      retry: true,
      user: userId,
    });

    return {
      cards,
      pending,
      failed,
    };
  }
}
