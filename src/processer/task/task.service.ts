import { Type } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VouchagramService } from './vouchagram/vouchagram.service';
import { CuelinksService } from './cuelinks/cuelinks.service';
import { AdmitadService } from './admitad/admitad.service';
import { CommitionService } from './commition/commition.service';
import { WhoowApiService } from './whoow/whoow.service';
import { UserService } from 'src/core/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly vouchagramService: VouchagramService,
    private readonly cuelinksService: CuelinksService,
    private readonly amitedService: AdmitadService,
    private readonly commitionService: CommitionService,
    private readonly whoowApiService: WhoowApiService,
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

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async handleAdmitedCommitionsStstus() {
    try {
      await this.commitionService.trackAdmitedUpdateProcess();
      this.log.log('@CRON - Update Admited data on Commition');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async reverifyFailedCoupones() {
    try {
      await this.vouchagramService.retryFailedCoupons();
      this.log.log('@CRON - ReTry vouchagramService erros');
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

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleAdmitedCampaines() {
    try {
      await this.amitedService.storeAllCompanies();
      this.log.log('@CRON - Update Admited get All data on Camoains');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async handleWhoowCategory() {
    try {
      await this.whoowApiService.getCategories();
      this.log.log('@CRON - Update Whoow get All data on Products ');
    } catch (error) {
      console.log(error.message || error);
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async WhoowConfig() {
  //   try {
  //     const res = await this.vouchagramService.pullVouchers({
  //       BrandProductCode: 'BakingoPromoCode6jltDI6idaSMGUTS',
  //       Denomination: '799',
  //       ExternalOrderId: 'ORDER_ID_5535',
  //       paymentId: '671b341c1a4346549c2918d1',
  //       Quantity: 1,
  //       user: '670643221e60757c08988f75',
  //     });
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
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
