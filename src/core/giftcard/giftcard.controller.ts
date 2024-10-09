import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GiftcardService } from './giftcard.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import {
  createFileFilter,
  FileValidationPipe,
} from 'src/pipes/file-validate/file-validate.pipe';
import { CreateGiftCardDto, UpdateGiftCardDto } from './giftcard.dto';
import { UserDto } from '../user/dto/user.dto';

@Controller('giftcard')
export class GiftcardController {
  constructor(private grifcardService: GiftcardService) {}

  @Get()
  async getAcctiveGiftCards() {
    return await this.grifcardService.getActiveGiftCard();
  }

  @Get('all')
  async getAllGiftCards() {
    return await this.grifcardService.getAllGiftCard();
  }

  @Get('/stock/:product/:amount')
  async getStocksCount(
    @Param('product') product: string,
    @Param('amount') amount: string,
  ) {
    return await this.grifcardService.checkStocks(product, Number(amount));
  }

  @Get('/payment/verify/:id')
  async verifyPayment(@Param('id') id: string) {
    return await this.grifcardService.verifyPayment(id);
  }

  @UseGuards(AuthUserGuard)
  @Post('/payment/:product/:amount')
  async getPaymentSession(
    @Param('product') product: string,
    @Param('amount') amount: string,
    @Body() body: { payAmount: number; user: string },
  ) {
    if (!body.payAmount) {
      throw new NotAcceptableException('Please Enter payAmount');
    }
    if (!body.user) {
      throw new NotAcceptableException('User information is required');
    }

    return await this.grifcardService.createPaymentSession(
      product,
      Number(amount),
      body,
    );
  }

  @Get(':id')
  async getByGiftCards(@Param('id') id: string) {
    return await this.grifcardService.getGiftCard(id);
  }

  @Post()
  @UseGuards(AuthUserGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  async createGiftCards(
    @UploadedFile(
      new FileValidationPipe(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    )
    file: Express.Multer.File,
    @Body() body: CreateGiftCardDto,
  ) {
    return await this.grifcardService.createGiftCard(body, file);
  }

  @Put(':id')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: createFileFilter(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    }),
  )
  async updateGiftCards(
    @Body() body: UpdateGiftCardDto,
    @Param('id') id: string,
    file?: Express.Multer.File,
  ) {
    return await this.grifcardService.updateGiftCard(id, body, file);
  }

  @Delete(':id')
  @UseGuards(AuthUserGuard)
  async deleteGiftCards(@Param('id') id: string) {
    return await this.grifcardService.deleteGiftCard(id);
  }

  @Get('vouchagram/:type')
  async getData(@Param('type') type: string) {
    return await this.grifcardService.getGites(type);
  }

  @Get('vouchagram/:type/:id')
  async getIdData(@Param('type') type: string, @Param('id') id: string) {
    return await this.grifcardService.getGiteId(type, id);
  }

  @Get('code/:id')
  @UseGuards(AuthUserGuard)
  async getIdToGiftCard(@Param('id') id: string) {
    return await this.grifcardService.getGiftCardCode(id);
  }

  @Get('mycards/:id')
  @UseGuards(AuthUserGuard)
  async getMYGiftCards(@Param('id') id: string) {
    return await this.grifcardService.getMyGiftCardCodes(id);
  }
}
