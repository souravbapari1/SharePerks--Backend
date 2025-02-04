import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { createFileFilter } from 'src/pipes/file-validate/file-validate.pipe';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter: createFileFilter(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    }),
  )
  async pushNotification(
    @Body() data: any,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.notifyService.pushNotification({
      id: data.id,
      message: data.message,
      title: data.title,
      image: image?.path,
    });
  }
}
