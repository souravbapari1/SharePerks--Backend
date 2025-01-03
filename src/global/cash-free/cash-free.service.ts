import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CashFreeService {
  public cahFreeApi = 'https://sandbox.cashfree.com';
  private cashFreeClientID = 'TEST102842697ad690418252d855b7f996248201';
  private cashFreeClientSecret =
    'cfsk_ma_test_68d82df1eb052f21339a5295bff9841d_9eb0f511';

  public cashFreeHeader = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-api-version': '2023-08-01',
    'x-client-id': this.cashFreeClientID,
    'x-client-secret': this.cashFreeClientSecret,
  };
  constructor(private readonly httpService: HttpService) {}

  async createSession(data: OrderPayment) {
    const reqPaymentSession =
      await this.httpService.axiosRef.post<PaymentSessionResponse>(
        this.cahFreeApi + '/pg/orders',
        data,
        {
          headers: this.cashFreeHeader,
        },
      );
    return reqPaymentSession.data;
  }

  async verifyPayment(id: string) {
    const reqPaymentVerify = await this.httpService.axiosRef.get<{
      cf_order_id: string;
      entity: string;
      order_amount: number;
      order_status: string;
      [key: string]: any;
    }>(this.cahFreeApi + '/pg/orders/' + id, {
      headers: this.cashFreeHeader,
    });
    return reqPaymentVerify.data;
  }
}

type OrderPayment = {
  order_id: string; // The ID of the payment document
  order_amount: number; // The amount of the order
  order_currency: string; // The currency of the order (e.g., 'INR')
  order_note: string; // A note about the order (e.g., 'gift card payment')
  customer_details: {
    customer_id: string; // The ID of the customer
    customer_name: string; // The name of the customer
    customer_email: string; // The email of the customer
    customer_phone: string; // The phone number of the customer as a string
  };
};

export interface PaymentSessionResponse {
  cf_order_id: string;
  created_at: string;
  customer_details: CustomerDetails;
  entity: string;
  order_amount: number;
  order_currency: string;
  order_expiry_time: string;
  order_id: string;
  order_meta: OrderMeta;
  order_note: any;
  order_status: string;
  payment_session_id: string;
}

export interface CustomerDetails {
  customer_id: string;
  customer_name: any;
  customer_email: string;
  customer_phone: string;
}

export interface OrderMeta {
  return_url: string;
  payment_methods: any;
}
