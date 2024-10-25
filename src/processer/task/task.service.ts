import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VouchagramService } from './vouchagram/vouchagram.service';
import { CuelinksService } from './cuelinks/cuelinks.service';
import { AdmitadService } from './admitad/admitad.service';
import { CommitionService } from './commition/commition.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly vouchagramService: VouchagramService,
    private readonly cuelinksService: CuelinksService,
    private readonly amitedService: AdmitadService,
    private readonly commitionService: CommitionService,
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
}
