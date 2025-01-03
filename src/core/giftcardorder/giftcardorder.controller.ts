import { Body, Controller, Param, Post } from '@nestjs/common';

import { CreateGifterDto } from './dto/CreateGifter.dto';
import { GiftcardorderService } from './giftcardorder.service';

@Controller('giftcardorder')
export class GiftcardorderController {
  constructor(private readonly giftcardorderService: GiftcardorderService) {}

  @Post('create/gifter')
  paymentGifter(@Body() createGiftcardorderDto: CreateGifterDto) {
    return this.giftcardorderService.createGifter(createGiftcardorderDto);
  }

  @Post('verify/gifter/:orderId')
  async createGifter(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.completeGifterOrder(orderId);
  }

  @Post('create/whoow')
  async paymentWhoow(@Body() createGiftcardorderDto: CreateGifterDto) {
    return await this.giftcardorderService.createWhoow(createGiftcardorderDto);
  }

  @Post('verify/whoow/:orderId')
  async createWhoow(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.completeWhoowOrder(orderId);
  }
}
