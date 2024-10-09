import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create_admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { FileValidationPipe } from 'src/pipes/file-validate/file-validate.pipe';
import { AdminLoginDto } from './dto/login_admin.dto';

@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async createAdmin(
    @UploadedFile(
      new FileValidationPipe(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    )
    file: Express.Multer.File,
    @Body() body: CreateAdminDto,
  ) {
    return await this.adminService.createAdmin(body, file);
  }
  @Post('/login')
  async loginUser(@Body() user: AdminLoginDto) {
    return await this.adminService.login(user);
  }
}
