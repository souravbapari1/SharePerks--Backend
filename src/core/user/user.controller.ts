import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUserGuard } from 'src/guards/user.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateAdminDto } from '../auth/admin/dto/update_admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { createFileFilter } from 'src/pipes/file-validate/file-validate.pipe';
import { AdminDto } from './dto/admin.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthUserGuard)
  @Get()
  async getUser(@Request() req: Request & { user: UserDto }) {
    return await this.userService.getUser(req.user);
  }

  @UseGuards(AuthUserGuard)
  @Put()
  async updateUser(
    @Request() req: Request & { user: UserDto },
    @Body() body: UserDto,
  ) {
    return await this.userService.updateUser(req.user, body);
  }

  @UseGuards(AuthUserGuard)
  @Post('holdings')
  async importHoldings(
    @Request() req: Request & { user: UserDto },
    @Body() body: any,
  ) {
    return await this.userService.connectBrokerUser(req.user, body);
  }

  @UseGuards(AdminGuard)
  @Get('admin')
  async getAdmin(@Request() req: Request & { user: any }) {
    return await this.userService.getAdmin(req.user._id);
  }

  @UseGuards(AdminGuard)
  @Put('admin/update')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter: createFileFilter(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    }),
  )
  async updateAdmin(
    @Request() req: Request & { user: any },
    @Body() body: AdminDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.userService.updateAdmin(req.user._id, body, image);
  }

  @UseGuards(AdminGuard)
  @Get('/all')
  async getUsers() {
    return await this.userService.getUsers();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async getFFullUsers(@Param('id') id: string) {
    return await this.userService.getFullUser(id);
  }
}