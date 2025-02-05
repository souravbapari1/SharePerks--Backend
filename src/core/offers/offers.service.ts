import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Categories } from 'src/schemas/categories.schema';
import { CategoriesService } from '../categories/categories.service';
import { Offers, OffersDocument } from 'src/schemas/offers.schema';
import { CreateOfferDto } from './dto/createOffer.dto';
import { UpdateOfferDto } from './dto/updateOffer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Offers.name)
    private readonly offersModel: Model<OffersDocument>,
    @InjectModel(Categories.name)
    private readonly categoryModel: Model<CategoriesService>,
  ) {}
  async createNewOffer(
    data: CreateOfferDto,
    files: {
      bannerImage?: Express.Multer.File[];
      offerImage?: Express.Multer.File[];
    },
  ) {
    if (!isValidObjectId(data.brandId)) {
      throw new NotAcceptableException('Invalid Brand Object Id');
    }
    if (!isValidObjectId(data.category)) {
      throw new NotAcceptableException('Invalid Category Object Id');
    }
    const checkIsCategoryExist = await this.categoryModel.findById(
      data.category,
    );
    if (!checkIsCategoryExist) {
      throw new NotFoundException('this category id not found');
    }
    const checkIsBrandExist = await this.brandModel.findById(data.brandId);
    if (!checkIsBrandExist) {
      throw new NotFoundException('this brand id not found');
    }
    const task = await this.offersModel.create({
      ...data,
      bannerImage: files.bannerImage[0].path,
      offerImage: files.offerImage[0].path,
    });
    return {
      status: true,
      message: 'new offer create successfully',
      data: task,
    };
  }

  async updateOffer(
    data: UpdateOfferDto,
    id: string,
    files: {
      bannerImage?: Express.Multer.File[];
      offerImage?: Express.Multer.File[];
    },
  ) {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Offer Object Id');
    }
    if (data.brandId) {
      if (!isValidObjectId(data.brandId)) {
        throw new NotAcceptableException('Invalid Brand Object Id');
      }
      const checkIsBrandExist = await this.brandModel.findById(data.brandId);
      if (!checkIsBrandExist) {
        throw new NotFoundException('this brand id not found');
      }
    }
    if (data.category) {
      if (!isValidObjectId(data.category)) {
        throw new NotAcceptableException('Invalid Category Object Id');
      }
      const checkIsCategoryExist = await this.categoryModel.findById(
        data.category,
      );
      if (!checkIsCategoryExist) {
        throw new NotFoundException('this category id not found');
      }
    }

    if (files.bannerImage) {
      data.bannerImage = files.bannerImage[0].path;
    }

    if (files.offerImage) {
      data.offerImage = files.offerImage[0].path;
    }

    const task = await this.offersModel.updateOne({ _id: id }, { $set: data });
    return {
      status: true,
      message: 'offer update successfully',
      data: task,
    };
  }

  async deleteOffer(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Offer Object Id');
    }

    const task = await this.offersModel.deleteOne({ _id: id });
    return {
      status: true,
      message: 'offer delete successfully',
      data: task,
    };
  }

  async getOffer(id: string):Promise<any> {
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Invalid Offer Object Id');
    }

    const task = await this.offersModel.findOne({ _id: id }).lean();
    if (!task) {
      throw new NotFoundException('Offer Not Found');
    }

    return {
      ...task,
      isExpired: this.isExpired(task.expDate.toISOString()),
    };
  }

  async getOffers() {
    const task = await this.offersModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      {
        $unwind: '$categoryData',
      },
    ]);
    return task.map((e) => ({
      ...e,
      isExpired: this.isExpired(e.expDate.toISOString()),
    }));
  }


  async getOffersPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const offers = await this.offersModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: '$categoryData' }, // Unwinds categoryData to make it an object instead of an array
      { $sort: { _id: -1 } }, // Sorting by newest offers first
      { $skip: skip }, // Skipping records for pagination
      { $limit: limit }, // Limiting the number of records per page
    ]);

    // Count total offers for pagination
    const total = await this.offersModel.countDocuments();

    // Add `isExpired` field based on `expDate`
    const offersWithExpiry = offers.map((e) => ({
      ...e,
      isExpired: this.isExpired(e.expDate.toISOString()),
    }));

    return {
      offers: offersWithExpiry,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOffers: total,
    };
  }

  async getOffersActive():Promise<any> {
    const task = await this.offersModel.find({ isEnable: true }).lean();
    return task.filter((e) => !this.isExpired(e.expDate.toISOString()))
      .map((e) => ({ ...e, isExpired: false }));
  }

  async getOffersByCategoryActive(category: string):Promise<any> {
    const task = await this.offersModel
      .find({ isEnable: true, category: category })
      .lean();
    return task
      .filter((e) => !this.isExpired(e.expDate.toISOString()))
      .map((e) => ({ ...e, isExpired: false }));
  }

  async getOffersByBrokerActive(stockISIN: string):Promise<any> {
    const task = await this.offersModel
      .find({ isEnable: true, stockISIN: stockISIN })
      .lean();
    return task
      .filter((e) => !this.isExpired(e.expDate.toISOString()))
      .map((e) => ({ ...e, isExpired: false }));
  }

  private isExpired(expDate: string): boolean {
    // Create a Date object from the expiration date string
    const date = new Date(expDate);

    // Get the current date and time
    const now = new Date();

    // Compare the expiration date with the current date
    return date < now; // Returns true if the date is in the past
  }
}
