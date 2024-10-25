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
  private host = 'http://194.238.19.82:1122';
  private access_key = '1236789';
  private authentication = 'MTQyNTQ4ZDItZWJmOC00YmY0LTk5YmQtOGU1Mjk2MTY3Njg0';
  private app_id = 'd5d4d67a-353e-46c4-ae9e-95864beea39d';
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
