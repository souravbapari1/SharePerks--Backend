import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Put,
  Param,
  Delete,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/storage.config';
import { AdminGuard } from 'src/guards/admin.guard';
import { createFileFilter } from 'src/pipes/file-validate/file-validate.pipe';
import { CreateBrandDto } from './dto/createBrand.dto';
import { BrandService } from './brand.service';
import { UpdateBrandDto } from './dto/updateBrand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get()
  async getActiveBrands() {
    const brands = await this.brandService.getActiveBrands();
    return brands;
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'brandImage', maxCount: 1 },
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
  async createNew(
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      brandImage?: Express.Multer.File[];
    },
    @Body() body: CreateBrandDto,
  ) {
    // Parse JSON fields from body
    console.log(body.offerTerms);

    if (typeof body.offerTerms === 'string') {
      body.offerTerms = JSON.parse(body.offerTerms);
    }
    if (typeof body.cashBackRates === 'string') {
      body.cashBackRates = JSON.parse(body.cashBackRates);
    }
    if (typeof body.isActive === 'string') {
      body.isActive = JSON.parse(body.isActive);
    }
    if (typeof body.category === 'string') {
      body.category = JSON.parse(body.category);
      body.category = [...new Set(body.category)];
    }

    return await this.brandService.createNewBrand({ data: body, files });
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bannerImage', maxCount: 1 },
        { name: 'brandImage', maxCount: 1 },
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
  async updateBrand(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      bannerImage?: Express.Multer.File[];
      brandImage?: Express.Multer.File[];
    },
    @Body() body: UpdateBrandDto,
  ) {
    // Parse JSON fields from body
    if (typeof body.offerTerms === 'string') {
      body.offerTerms = JSON.parse(body.offerTerms);
    }
    if (typeof body.cashBackRates === 'string') {
      body.cashBackRates = JSON.parse(body.cashBackRates);
    }
    if (typeof body.isActive === 'string') {
      body.isActive = JSON.parse(body.isActive);
    }
    if (typeof body.category === 'string') {
      body.category = JSON.parse(body.category);
      body.category = [...new Set(body.category)];
    }
    return await this.brandService.updateBrand({ data: body, files, id });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteBrand(@Param('id') id: string) {
    return await this.brandService.deleteBrand(id);
  }

  @Get('all')
  async getBrands() {
    const brands = await this.brandService.getBrands();
    return brands;
  }

  @Get(':id')
  async getBrand(@Param('id') id: string) {
    const brand = await this.brandService.getBrand(id);
    return brand;
  }

  @Get('/search/:name')
  async searchActiveBrand(@Param('name') name: string) {
    const brand = await this.brandService.searchActiveBrandsByName(name);
    return brand;
  }

  @Get('/find/:name')
  async findActiveBrand(@Param('name') name: string) {
    const brand = await this.brandService.getActiveBrandsByCategory(name);
    return brand;
  }

  @Get('/search/all/:name')
  @UseGuards(AdminGuard)
  async searchBrand(@Param('name') name: string) {
    const brand = await this.brandService.searchBrandsByName(name);
    return brand;
  }
}
