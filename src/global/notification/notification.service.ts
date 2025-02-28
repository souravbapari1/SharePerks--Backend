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
        `${this.host}/notification`,
        {
          title: title,
          body: message,
          users: [id],
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

  async sendNotification({
    id,
    message,
    title,
    image,
  }: {
    id: string;
    message: string;
    title: string;
    image?: string;
  }) {
    try {
      const task = await this.httpService.axiosRef.post(
        `${this.host}/onesignal/push/`,
        {
          title: title,
          body: message,
          image: image,
          users: [id],
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
