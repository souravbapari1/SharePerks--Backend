import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateGifterDto } from './dto/CreateGifter.dto';
import { GiftcardorderService } from './giftcardorder.service';

@Controller('giftcardorder')
export class GiftcardorderController {
  constructor(private readonly giftcardorderService: GiftcardorderService) {}

  @Post('create/gifter')
  paymentGifter(@Body() createGiftcardorderDto: CreateGifterDto) {
    return this.giftcardorderService.createGifter(createGiftcardorderDto);
  }

  @Get('verify/gifter/:orderId')
  async createGifter(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.completeGifterOrder(orderId);
  }

  @Post('create/whoow')
  async paymentWhoow(@Body() createGiftcardorderDto: CreateGifterDto) {
    return await this.giftcardorderService.createWhoow(createGiftcardorderDto);
  }

  @Get('verify/whoow/:orderId')
  async createWhoow(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.completeWhoowOrder(orderId);
  }

  @Get('order/:orderId')
  async getWhoowOrder(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.retryAllWhoowErrors();
  }

  @Get('/gifter/:orderId')
  async getGifterOrder(@Param('orderId') orderId: string) {
    return await this.giftcardorderService.completeGifterOrder(orderId, true);
  }

  @Get('/cards/:user')
  async getGifterOrderUser(@Param('user') user: string) {
    return await this.giftcardorderService.getMyCards(user);
  }

  @Get('/errors')
  async getErrors(
    @Query('search') searchQuery?: string, // Optional search query
    @Query('page') page: number = 1, // Default page 1
    @Query('limit') limit: number = 10, // Default limit 10
  ) {
    return await this.giftcardorderService.getErrors(
      searchQuery || '',
      Number(page),
      Number(limit),
    );
  }
}
