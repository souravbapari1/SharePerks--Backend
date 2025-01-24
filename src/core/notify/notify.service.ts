import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/global/notification/notification.service';

@Injectable()
export class NotifyService {
  constructor(private readonly notificationService: NotificationService) {}

  async pushNotification({
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
    const task = await this.notificationService.sendNotification({
      id,
      message,
      title,
      image: image && 'https://api.shareperks.in/' + image,
    });
    return task;
  }
}
