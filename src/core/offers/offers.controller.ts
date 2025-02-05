import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/createOffer.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  createFileFilter,
  FileValidationPipe,
} from 'src/pipes/file-validate/file-validate.pipe';
import { storage } from 'src/config/storage.config';
import { OffersService } from './offers.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateOfferDto } from './dto/updateOffer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offerService: OffersService) {}

  @Get()
  async getOffers() {
    return await this.offerService.getOffersActive();
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async getOffersAll() {
    return await this.offerService.getOffers();
  }

  @Get(':id')
  async getOffer(@Param('id') id: string) {
    return await this.offerService.getOffer(id);
  }

  @Get('category/:id')
  async getOfferByCategory(@Param('id') id: string) {
    return await this.offerService.getOffersByCategoryActive(id);
  }

  @Get('broker/:id')
  async getOfferByBroker(@Param('id') id: string) {
    return await this.offerService.getOffersByBrokerActive(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'offerImage', maxCount: 1 },
      ],
      {
        fileFilter: createFileFilter(
          ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
          8 * 1024 * 1024, // 8MB max size
        ),
        storage,
      },
    ),
  )
  async createOffer(
    @Body() body: CreateOfferDto,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      offerImage?: Express.Multer.File[];
    },
  ) {
    if (typeof body.commissionRate === 'string')
      body.commissionRate = JSON.parse(body.commissionRate);
    if (typeof body.isEnable === 'string')
      body.isEnable = JSON.parse(body.isEnable);
    if (typeof body.isInSlide === 'string')
      body.isInSlide = JSON.parse(body.isInSlide);
    if (!files.bannerImage) {
      throw new NotAcceptableException('Please Add Banner image File');
    }

    if (!files.offerImage) {
      throw new NotAcceptableException('Please Add Offer image File');
    }

    return await this.offerService.createNewOffer(body, files);
  }

  @Get('all/:page/:limit')
  async getOffersPagination(
    @Param('page') page: string,
    @Param('limit') limit: string,
  ) {
    return await this.offerService.getOffersPagination(+page, +limit);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'offerImage', maxCount: 1 },
      ],
      {
        fileFilter: createFileFilter(
          ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
          8 * 1024 * 1024, // 8MB max size
        ),
        storage,
      },
    ),
  )
  async updateOffer(
    @Param('id') id: string,
    @Body() body: UpdateOfferDto,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      offerImage?: Express.Multer.File[];
    },
  ) {
    if (typeof body.commissionRate === 'string')
      body.commissionRate = JSON.parse(body.commissionRate);
    if (typeof body.isEnable === 'string')
      body.isEnable = JSON.parse(body.isEnable);
    if (typeof body.isInSlide === 'string')
      body.isInSlide = JSON.parse(body.isInSlide);

    return await this.offerService.updateOffer(body, id, files);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteOffer(@Param('id') id: string) {
    return await this.offerService.deleteOffer(id);
  }
}
