import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dio/createUserDto.dto';
import { VerifyUserOtpDto } from './dio/verifyUserOtp.dto';
import { CompleteUserDto } from './dio/completeUse.dto';
import { AuthUserGuard } from 'src/guards/user.guard';
import { UserDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async auth(@Body() body: CreateUserDto) {
    return await this.authService.authAUser(body);
  }

  @Post('resend')
  async resendOtp(@Body() body: CreateUserDto) {
    return await this.authService.reSendOtp(body);
  }

  @Post('verify')
  async resend(@Body() body: VerifyUserOtpDto) {
    return await this.authService.verifyUserOtp(body);
  }

  @UseGuards(AuthUserGuard)
  @Post('complete')
  async complete(
    @Request() req: Request & { user: UserDto },
    @Body() body: CompleteUserDto,
  ) {
    return await this.authService.completeProfile(req.user._id, body);
  }
}
