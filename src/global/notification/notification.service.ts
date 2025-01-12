import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
  private host = 'https://worker.shareperks.in';
  private access_key = '1236789';
  private authentication =
    'os_v2_app_czqloyzk2reezaun6xbwdkrxnlzau6yat2bec555vhk3clc4vq5i7ud7n247l7rri7r34vv43u7xlzdmbsrdl3rwftwxfbtr5d3dvsi';
  private app_id = '1660b763-2ad4-484c-828d-f5c361aa376a';
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async sendNotificationQuickUser({
    id,
    message,
    title,
  }: {
    id: string;
    message: string;
    title: string;
  }) {
    try {
      const task = await this.httpService.axiosRef.post(
        `${this.host}/onesignal/push/quick/${id}`,
        {
          app_id: this.app_id,
          title: title,
          desc: message,
        },
        {
          headers: {
            Authorization: `${this.authentication}`,
            'Content-Type': 'application/json',
            'access-key': this.access_key,
          },
        },
      );
      await this.notificationModel.create({
        user: id,
        title,
        message,
      });
      return task.data;
    } catch (error) {
      console.log(error);
    }
  }
}
