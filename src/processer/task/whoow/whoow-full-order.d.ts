export interface WhoowFullOrder {
  orderId: string;
  refno: string;
  status: string;
  statusLabel: string;
  statusImage: any;
  statusLevel: any;
  createdBy: string;
  date: string;
  scheduledDate: string;
  extCustomerId: string;
  grandTotal: string;
  subTotal: string;
  discount: number;
  conversionRate: string;
  baseGrandTotal: string;
  baseSubTotal: string;
  baseCurrency: BaseCurrency;
  currencyConversionCharge: CurrencyConversionCharge;
  packaging: Packaging;
  corporateDiscount: CorporateDiscount;
  totalQty: number;
  handlingCharges: HandlingCharges;
  convenienceCharge: number;
  tax: Tax;
  orderTypeCode: any;
  products: Product[];
  currency: Currency2;
  address: Address;
  billing: Billing;
  etaMessage: string;
  shipments: Shipment[];
  shipping: Shipping;
  payments: Payment[];
  orderType: string;
  orderMode: string;
  deliveryMode: string;
  fullFilledBySeller: boolean;
  consolidatedEmailStatus: string;
  cardTypes: string[];
  isMreOrder: boolean;
  cancel: Cancel;
  bizApprove: BizApprove;
  additionalTxnFields: AdditionalTxnFields;
  delivery: Delivery;
  cards: Cards;
  orderHistory: OrderHistory[];
  extensionParams: any[];
  orderReceipt: string;
}

export interface BaseCurrency {
  code: string;
  numericCode: string;
  symbol: string;
}

export interface CurrencyConversionCharge {
  amount: number;
  label: any;
}

export interface Packaging {}

export interface CorporateDiscount {
  label: string;
  amount: string;
  percentage: string;
}

export interface HandlingCharges {
  label: any;
  amount: any;
}

export interface Tax {
  amount: string;
  label: string;
}

export interface Product {
  name: string;
  type: string;
  qty: number;
  price: string;
  total: string;
  discount: string;
  corporateDiscount: CorporateDiscount2;
  image: Image;
  currency: Currency;
  mergedQty: number;
}

export interface CorporateDiscount2 {
  label: string;
  amount: string;
  percentage: string;
}

export interface Image {
  thumbnail: string;
  mobile: string;
  base: string;
  small: string;
}

export interface Currency {
  code: string;
  numericCode: string;
  symbol: string;
}

export interface Currency2 {
  code: string;
  numericCode: string;
  symbol: string;
}

export interface Address {
  salutation: any;
  name: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  city: any;
  region: any;
  postcode: string;
  countryCode: string;
  country: string;
  telephone: string;
  email: string;
  gstn: any;
  company: any;
}

export interface Billing {
  salutation: any;
  name: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  city: any;
  region: any;
  postcode: string;
  countryCode: string;
  country: string;
  telephone: string;
  email: string;
  gstn: any;
  company: any;
}

export interface Shipment {
  tracks: any[];
}

export interface Shipping {
  method: Method;
}

export interface Method {
  code: string;
  label: string;
  amount: number;
}

export interface Payment {
  code: string;
  name: string;
  amount: string;
  tds: any;
  poNumber: string;
}

export interface Cancel {
  allowed: boolean;
  allowedWithIn: number;
}

export interface BizApprove {
  status: number;
  actionDate: any;
  by: any;
  comment: any;
}

export interface AdditionalTxnFields {
  remarks: string;
}

export interface Delivery {
  summary: Summary;
}

export interface Summary {
  email: Email;
  sms: Sms;
  totalCardsCount: number;
}

export interface Email {
  totalCount: number;
  delivered: number;
  failed: number;
  inProgress: number;
}

export interface Sms {
  totalCount: number;
  delivered: number;
  failed: number;
  inProgress: number;
}

export interface Cards {
  summary: Summary2;
}

export interface Summary2 {
  success: number;
  inProgress: number;
  failed: number;
  totalCardsCount: number;
}

export interface OrderHistory {
  eventGroup: string;
  eventStatus: string;
  label: string;
}

export interface WhoowActiveOrder {
  products: Products;
  cards: Card[];
  currency: Currency;
  deliveryMode: string;
  egvDeliveryType: any;
  delivery: Delivery2;
  total_cards: number;
}

export interface Products {
  EGCGBMYT002: Egcgbmyt002;
}

export interface Egcgbmyt002 {
  sku: string;
  name: string;
  balanceEnquiryInstruction: any;
  specialInstruction: string;
  images: Images;
  cardBehaviour: string;
}

export interface Images {
  thumbnail: string;
  mobile: string;
  base: string;
  small: string;
}

export interface Card {
  sku: string;
  productName: string;
  labels: Labels;
  cardNumber: string;
  cardPin: string;
  activationCode: any;
  barcode: any;
  activationUrl: any;
  redemptionUrl: RedemptionUrl;
  addToSamsungWallet: string;
  formats: any[];
  amount: string;
  validity: string;
  issuanceDate: string;
  sequenceNumber: string;
  cardId: number;
  recipientDetails: RecipientDetails;
  theme: string;
}

export interface Labels {
  cardNumber: string;
  cardPin: string;
  activationCode: string;
  samsungWalletLabel: string;
  sequenceNumber: string;
  validity: string;
}

export interface RedemptionUrl {
  label: string;
  url: string;
}

export interface RecipientDetails {
  salutation: any;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  mobileNumber: string;
  status: string;
  failureReason: string;
  delivery: Delivery;
}

export interface Delivery {
  mode: string;
  status: Status;
}

export interface Status {
  sms: Sms;
  email: Email;
}

export interface Sms {
  status: string;
  reason: string;
}

export interface Email {
  status: string;
  reason: string;
}

export interface Currency {
  code: string;
  numericCode: string;
  symbol: string;
}

export interface Delivery2 {
  summary: Summary;
}

export interface Summary {
  email: Email2;
  sms: Sms2;
  totalCardsCount: number;
}

export interface Email2 {
  totalCount: number;
  delivered: number;
  failed: number;
  inProgress: number;
}

export interface Sms2 {
  totalCount: number;
  delivered: number;
  failed: number;
  inProgress: number;
}
