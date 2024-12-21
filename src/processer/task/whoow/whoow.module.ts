import { Module } from '@nestjs/common';
import { WhoowApiService } from './whoow.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UserService } from 'src/core/user/user.service';

@Module({
  imports: [HttpModule],
  providers: [WhoowApiService],
  exports: [WhoowApiService],
})
export class WhoowApiModule {}
