import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { NotificationService } from 'src/global/notification/notification.service';
import { Notification } from 'src/schemas/notification.schema';
import { NotificationModule } from 'src/global/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}
