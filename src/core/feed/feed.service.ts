import { Injectable } from '@nestjs/common';
import { OffersService } from '../offers/offers.service';
import { BrandService } from '../brand/brand.service';
import { CouponService } from '../coupon/coupon.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { CategoriesService } from '../categories/categories.service';

import { GiftcardService } from '../giftcard/giftcard.service';
import { WhoowService } from '../whoow/whoow.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly offerService: OffersService,
    private readonly brandService: BrandService,
    private readonly couponService: CouponService,
    private readonly categoryService: CategoriesService,
    private readonly userService: UserService,
    private readonly giftcardService: GiftcardService,
    private readonly whoowService: WhoowService,
  ) {}
  async getFeed(user?: string) {
    const offers = await this.offerService.getOffersActive();
    const brands = await this.brandService.getActiveBrands();
    const coupons = await this.couponService.getCouponsActive();
    const categories = await this.categoryService.getAllCategories();
    const bannerGiftCards = await this.bannerGiftCards();
    const homeGiftCards = await this.getHomCards();
    let offerFromWallet;
    if (user) {
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
      bannerGiftCards,
      homeGiftCards,
      topOffers: offers.filter((e) => e.isInSlide == true),
    };
  }

  async bannerGiftCards() {
    let gifterCards: any = await this.giftcardService.getBannerGiftCards();
    let whoowCards = await this.whoowService.getBannerGiftCards();
    return { gifterCards, whoowCards };
  }

  async getHomCards() {
    let gifterCards = await this.giftcardService.getHomeGiftCards();
    let whoohcards = await this.whoowService.getHomeGiftCards();
    return {
      gifterCards,
      whoohcards,
    };
  }
}
