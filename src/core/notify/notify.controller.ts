import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NotifyService } from './notify.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileFilter } from 'src/pipes/file-validate/file-validate.pipe';
import { storage } from 'src/config/storage.config';

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
