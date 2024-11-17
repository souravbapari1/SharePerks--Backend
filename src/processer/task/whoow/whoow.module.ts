import { Module } from '@nestjs/common';
import { WhoowService } from './whoow.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [WhoowService],
  exports: [WhoowService],
})
export class WhoowModule {}
