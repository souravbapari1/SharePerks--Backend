import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { CreateBrandDto } from './dto/createBrand.dto';
import { UpdateBrandDto } from './dto/updateBrand.dto';
import { Categories } from 'src/schemas/categories.schema';
import { isValidObjectId } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<CategoriesService>,
  ) {}

  async createNewBrand({
    data,
    files,
  }: {
    files: {
      bannerImage?: Express.Multer.File[];
      brandImage?: Express.Multer.File[];
    };
    data: CreateBrandDto;
  }) {
    if (!files.bannerImage?.length) {
      throw new BadRequestException('bannerImage file is required');
    }
    if (!files.brandImage?.length) {
      throw new BadRequestException('brandImage file is required');
    }

    const catList: Array<string> = data.category;
    for (let i = 0; i < catList.length; i++) {
      const element = catList[i];
      if (!isValidObjectId(element)) {
        throw new NotAcceptableException('Category id is invalid');
      }
    }
    const existingCategories = await this.categoryModel.find({
      _id: { $in: catList },
    });
    const allExist = existingCategories.length === catList.length;

    if (!allExist) {
      throw new NotFoundException('Category not Found');
    }

    const brand = await this.brandModel.create({
      ...data,
      brandImage: files.brandImage[0].path,
      bannerImage: files.bannerImage[0].path,
    });

    return {
      status: true,
      message: 'brand create successfully',
      brand,
    };
  }

  async updateBrand({
    data,
    files,
    id,
  }: {
    files: {
      bannerImage?: Express.Multer.File[];
      brandImage?: Express.Multer.File[];
    };
    data: UpdateBrandDto;
    id: string;
  }) {
    if (files.bannerImage?.length) {
      data.bannerImage = files.bannerImage[0].path;
    }
    if (files.brandImage?.length) {
      data.brandImage = files.brandImage[0].path;
    }
    if (data.category) {
      const catList: Array<string> = data.category;
      for (let i = 0; i < catList.length; i++) {
        const element = catList[i];
        if (!isValidObjectId(element)) {
          throw new NotAcceptableException('Category id is invalid');
        }
      }
      const existingCategories = await this.categoryModel.find({
        _id: { $in: catList },
      });
      const allExist = existingCategories.length === catList.length;

      if (!allExist) {
        throw new NotFoundException('Category not Found');
      }
    }
    const brand = await this.brandModel.findOneAndUpdate(
      { _id: id }, // Filter to find the document by id
      data, // Data to update
      { new: true }, // Return the updated document
    );
    return {
      status: true,
      message: 'brand update successfully',
      brand,
    };
  }

  async deleteBrand(id: string) {
    await this.brandModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'brand delete successfully',
    };
  }

  async getBrand(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }
    return brand;
  }

  async getBrands() {
    const brands = await this.brandModel.aggregate([
      {
        $addFields: {
          category: {
            $map: {
              input: '$category',
              as: 'catId',
              in: {
                $toObjectId: '$$catId',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
    ]);

    return brands;
  }

  async getBrandsPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const brands = await this.brandModel.aggregate([
      {
        $addFields: {
          category: {
            $map: {
              input: '$category',
              as: 'catId',
              in: { $toObjectId: '$$catId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $sort: { _id: -1 } }, // Sorting by newest brands first
      { $skip: skip }, // Skipping records for pagination
      { $limit: limit }, // Limiting the number of records per page
    ]);

    const total = await this.brandModel.countDocuments();

    return {
      brands,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBrands: total,
    };
  }

  async getActiveBrands() {
    const brands = await this.brandModel.find({ isActive: true });
    return brands;
  }

  async getActiveBrandsByCategory(category: string) {
    if (!isValidObjectId(category)) {
      throw new NotAcceptableException('Category id is invalid');
    }
    const brands = await this.brandModel.find({
      isActive: true,
      category: category,
    });
    return brands;
  }

  async searchActiveBrandsByName(name: string) {
    const brands = await this.brandModel.find({
      name: new RegExp(name, 'i'),
      isActive: true,
    });
    return brands;
  }

  async searchBrandsByName(name: string) {
    const brands = await this.brandModel.find({ name: new RegExp(name, 'i') }); // Case-insensitive search
    return brands;
  }
}
