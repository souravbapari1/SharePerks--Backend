import { Injectable } from '@nestjs/common';
import { OffersService } from '../offers/offers.service';
import { BrandService } from '../brand/brand.service';
import { CouponService } from '../coupon/coupon.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly offerService: OffersService,
    private readonly brandService: BrandService,
    private readonly couponService: CouponService,
    private readonly categoryService: CategoriesService,
    private readonly userService: UserService,
  ) {}
  async getFeed(user?: string) {
    const offers = await this.offerService.getOffersActive();
    const brands = await this.brandService.getActiveBrands();
    const coupons = await this.couponService.getCouponsActive();
    const categories = await this.categoryService.getAllCategories();
    let offerFromWallet;
    if (user.toString() != 'undefined') {
      const userData = await this.userService.getFullUser(user);
      if (userData.user.brokerConnected) {
        const holdIdes: string[] = userData.holdings.data.securities.map(
          (e) => e.isin,
        );
        offerFromWallet = offers.filter((e) => holdIdes.includes(e.stockISIN));
      }
    }
    return {
      offers,
      brands,
      categories,
      coupons,
      offerFromWallet,
      topOffers: offers.filter((e) => e.isInSlide == true),
    };
  }
}
