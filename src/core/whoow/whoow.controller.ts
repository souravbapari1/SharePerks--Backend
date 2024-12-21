import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WhoowService } from './whoow.service';
import { CreateWhoowDto } from './dto/create-whoow.dto';
import { UpdateWhoowDto } from './dto/update-whoow.dto';
import * as fs from 'fs';
import { WhoowProducts } from 'src/processer/task/whoow/whoow';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import {
  FileValidationPipe,
  createFileFilter,
} from 'src/pipes/file-validate/file-validate.pipe';
import { GiftcardService } from '../giftcard/giftcard.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { CreateWhoowPaymentSessionDto } from './dto/payment-session.dto';
@Controller('whoow')
export class WhoowController {
  constructor(
    private readonly whoowService: WhoowService,
    private readonly giftcardService: GiftcardService,
  ) {}

  @Get('/products')
  whoohProducts() {
    const data = fs.readFileSync('whoow_products.json', 'utf8');
    const products = JSON.parse(data);
    return products;
  }

  @Get('/product/:id')
  whoohProduct(@Param('id') id: string) {
    const data = fs.readFileSync('whoow_products.json', 'utf8');
    const products: WhoowProducts['products'] = JSON.parse(data);
    const product = products.find((e) => e.sku == id);
    if (product) {
      return product;
    }
    throw new NotFoundException('Product Not Found');
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  async create(
    @Body() createWhoowDto: CreateWhoowDto,
    @UploadedFile(
      new FileValidationPipe(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    )
    file: Express.Multer.File,
  ) {
    console.log(createWhoowDto.isEnable);

    createWhoowDto.pricing = JSON.parse(createWhoowDto.pricing);
    createWhoowDto.data = JSON.parse(createWhoowDto.data);
    createWhoowDto.isEnable = createWhoowDto.isEnable.toString() == 'true';
    // Get User images ----
    return await this.whoowService.create(createWhoowDto, file);
  }

  @Get()
  async findAll() {
    return await this.whoowService.findAll();
  }

  @Get('/active')
  async findAllActive() {
    return await this.whoowService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.whoowService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter: createFileFilter(['.jpg', '.jpeg', '.png'], 8 * 1024 * 1024),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateWhoowDto: UpdateWhoowDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (updateWhoowDto.data) {
      updateWhoowDto.data = JSON.parse(updateWhoowDto.data);
    }

    if (updateWhoowDto.pricing) {
      updateWhoowDto.pricing = JSON.parse(updateWhoowDto.pricing);
    }

    if (updateWhoowDto.isEnable) {
      updateWhoowDto.isEnable = JSON.parse(updateWhoowDto.isEnable.toString());
      console.log('set');
    }
    console.log(updateWhoowDto.isEnable);

    return await this.whoowService.update(id, updateWhoowDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.whoowService.remove(id);
  }

  @Post('/payment/:user')
  @UseGuards(AuthUserGuard)
  async genPaymentSession(
    @Param('user') id: string,
    @Body() data: CreateWhoowPaymentSessionDto,
  ) {
    return await this.whoowService.createPaymentSession(id, data);
  }

  @Get('/payment/verify/:id')
  @UseGuards(AuthUserGuard)
  async verifyPaymentSession(@Param('id') id: string) {
    return await this.whoowService.verifyPayment(id);
  }
}
