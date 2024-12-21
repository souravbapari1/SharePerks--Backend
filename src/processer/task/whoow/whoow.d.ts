export interface WhoowProducts {
  id: number;
  name: string;
  url: string;
  description: any;
  shortDescription: any;
  canonicalUrl: any;
  metaIndex: any;
  metaKeyword: any;
  pageTitle: any;
  metaDescription: any;
  images: Images;
  productsCount: number;
  products: Product[];
}
export interface Product {
  sku: string;
  name: string;
  currency: Currency;
  url: string;
  offerShortDesc: any;
  relatedProductOptions: RelatedProductOptions;
  minPrice: string;
  maxPrice: string;
  price: Price;
  discounts: any[];
  couponcodeDesc: any;
  images: Images;
  createdAt: string;
  updatedAt: string;
  campaigns: any;
}

export interface Currency {
  code: string;
  symbol?: string;
  numericCode: string;
}

export interface RelatedProductOptions {
  PROMO: boolean;
  DESIGNS: boolean;
}

export interface Price {
  cpg: any;
}

export interface Images {
  thumbnail: string;
  mobile: string;
  base: string;
  small: string;
}
