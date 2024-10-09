export interface VouchagramResponse {
  status: string;
  data: any;
  desc: string;
  code: string;
}

export interface VouchagramStock {
  AvailableQuantity: number;
  BrandName: string;
}

export interface VouchagramCreateVoucherRequest {
  BrandProductCode: string;
  Denomination: string;
  Quantity: number;
  ExternalOrderId: string;
}

export interface VouchagramCreateVoucherRequest {
  BrandProductCode: string;
  Denomination: string;
  Quantity: number;
  ExternalOrderId: string;
}

export interface VoucherData {
  PullVouchers: PullVoucher[];
  ErrorCode: string;
  ErrorMessage: string;
  ExternalOrderIdOut: string;
  Message: string;
  ResultType: string;
  BrandProductCode: string;
}

export interface PullVoucher {
  Vouchers: Voucher[];
  ProductGuid: string;
  ProductName: string;
  VoucherName: string;
}

export interface Voucher {
  VoucherNo: string;
  VoucherGuid: string;
  EndDate: string;
  Value: string;
  Voucherpin: string;
  VoucherGCcode: string;
}
