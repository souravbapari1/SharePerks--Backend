import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
