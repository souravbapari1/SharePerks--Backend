import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create_admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { FileValidationPipe } from 'src/pipes/file-validate/file-validate.pipe';
import { AdminLoginDto } from './dto/login_admin.dto';
import { UpdateAdminDto } from './dto/update_admin.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage }))
  async createAdmin(
    @UploadedFile(
      new FileValidationPipe(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    )
    file: Express.Multer.File,
    @Body() body: CreateAdminDto,
  ) {
    console.log(body);

    if (body.permissions) {
      body.permissions = JSON.parse(body.permissions.toString());
    }
    return await this.adminService.createAdmin(body, file);
  }

  @Post('/login')
  async loginUser(@Body() user: AdminLoginDto) {
    return await this.adminService.login(user);
  }

  @UseGuards(AdminGuard)
  @Get('')
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }

  @Get('/:id')
  @UseGuards(AdminGuard)
  async getAdminById(@Param('id') id: string) {
    return await this.adminService.getAdminById(id);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteAdmin(@Param('id') id: string) {
    return await this.adminService.deleteAdmin(id);
  }

  @Post('/:id')
  @UseGuards(AdminGuard)
  async updateAdmin(@Param('id') id: string, @Body() body: UpdateAdminDto) {
    return await this.adminService.updateAdmin(id, body);
  }
}
