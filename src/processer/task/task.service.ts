import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdmitadService } from './admitad/admitad.service';
import { CommitionService } from './commition/commition.service';
import { CuelinksService } from './cuelinks/cuelinks.service';
import { VouchagramService } from './vouchagram/vouchagram.service';
import { WhoowApiService } from './whoow/whoow.service';
import { GiftcardorderService } from 'src/core/giftcardorder/giftcardorder.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly vouchagramService: VouchagramService,
    private readonly cuelinksService: CuelinksService,
    private readonly amitedService: AdmitadService,
    private readonly commitionService: CommitionService,
    private readonly whoowApiService: WhoowApiService,
    private readonly giftCardOrders: GiftcardorderService,
  ) {}
  private log = new Logger();
  @Cron(CronExpression.EVERY_12_HOURS)
  async handleUpdateProductsCron() {
    try {
      await this.vouchagramService.getBrands();
      this.log.log('@CRON - Update Products data on vouchagram');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  // @Cron(CronExpression.EVERY_11_HOURS)
  @Cron(CronExpression.EVERY_12_HOURS)
  async handleUpdateStoresCron() {
    try {
      await this.vouchagramService.getStores();
      this.log.log('@CRON - Update shops data on vouchagram');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleUpdateCuelinksCampainesCron() {
    try {
      await this.cuelinksService.getCompanies();
      this.log.log('@CRON - Update Campaines data on Cuelinks');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleAdmitedCommitionsStstus() {
    try {
      await this.commitionService.trackAdmitedUpdateProcess();
      this.log.log('@CRON - Update Admited data on Commition');
    } catch (error) {
      console.log(error.message || error);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCuelinksCommitionsStstus() {
    try {
      await this.commitionService.trackCuelinksUpdateProcess();
      this.log.log('@CRON - Update Cuelinks data on Commition');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async reverifyFailedCoupones() {
    try {
      await this.giftCardOrders.retryAllGifter();
      this.log.log('@CRON - ReTry Gifter errors');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async reverifyFailedWhoowCoupones() {
    try {
      await this.giftCardOrders.retryAllWhoowErrors();
      this.log.log('@CRON - ReTry Whoow errors');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleAdmitedCampaines() {
    try {
      await this.amitedService.storeAllCompanies();
      this.log.log('@CRON - Update Admited get All data on Camoains');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleWhoowCategory() {
    try {
      await this.whoowApiService.getCategoriesAndProducts();
      this.log.log('@CRON - Update Whoow get All data on Products ');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async WhoowConfig() {
  //   try {
  //     const res = await this.vouchagramService.pullVouchers({
  // BrandProductCode: 'BakingoPromoCode6jltDI6idaSMGUTS',
  // Denomination: '799',
  // ExternalOrderId: 'ORDER_ID_5535',
  //       paymentId: '671b341c1a4346549c2918d1',
  //       Quantity: 1,
  //       user: '670643221e60757c08988f75',
  //     });
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async WhoowConfig() {
  //   try {
  //     const user: any = { name: 'Testing' };
  //     // const res = await this.whoowApiService.createOrder({
  //     //   amount: 1000,
  //     //   id: 'test444w3',
  //     //   sku: 'CNPIN',
  //     //   upi: 'user@pnb',
  //     //   user,
  //     // });
  //     const cards = await this.whoowApiService.getActiveOrders('ABF5551320082');

  //     this.log.log('@CRON - Update Whoow get All data on Products ');
  //   } catch (error) {
  //     console.log(error.response.data);

  //     console.log(error.message || error);
  //   }
  // }
}
