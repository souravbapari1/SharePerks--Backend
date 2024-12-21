import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { WhoowProducts } from './whoow';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class WhoowApiService {
  private clientId: string;
  private clientSecret: string;
  private host: string;
  private userName: string;
  private password: string;
  private date: Date;

  constructor(private readonly httpService: HttpService) {
    this.clientId = '9d073d6c0c9de11e0cf36d4e1dfb4f1c';
    this.clientSecret = 'd17cb30ea3a00be6cf6f05f86b7d4c38';
    this.host = 'https://sandbox.woohoo.in';
    this.userName = 'shareperksapisandboxb2b@woohoo.in';
    this.password = 'shareperksapisandboxb2b@1234';
    this.date = new Date();
  }

  async getCategories(): Promise<any> {
    try {
      const token = await this.newTokenRequest();
      console.log(token);

      const req = await this.httpService.axiosRef.get(
        `${this.host}/rest/v3/catalog/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            dateAtClient: this.date.toISOString(),
          },
        },
      );
      await this.getProducts(req.data.id);
      // console.log(JSON.stringify(req.data));

      return req.data;
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

  async getProducts(id: string): Promise<any> {
    try {
      const token = await this.newTokenRequest();
      const data = await this.loadAllProducts(id, token, 0, []);
      fs.writeFileSync(
        'whoow_products.json',
        JSON.stringify(data.filter((e) => e.currency.code == 'INR')),
      );
      return data;
    } catch (error: any) {
      console.log(error.response.data);
    }
  }

  private async loadAllProducts(
    id: string,
    token: string,
    offset: number = 0,
    data: WhoowProducts['products'] = [],
  ): Promise<WhoowProducts['products']> {
    const limit = 10;
    try {
      const req = await this.httpService.axiosRef.get<WhoowProducts>(
        `${this.host}/rest/v3/catalog/categories/${id}/products?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            dateAtClient: this.date.toISOString(),
          },
        },
      );

      // Combine the current batch of products with previously fetched ones
      const combinedData = [...data, ...req.data.products];

      // Check if we've fetched all products
      if (combinedData.length >= req.data.productsCount) {
        return combinedData; // Return the complete list of products
      }

      // Fetch the next batch
      console.log({ offset });

      return this.loadAllProducts(id, token, offset + limit, combinedData);
    } catch (error) {
      console.error('Error loading products:', error);
      throw new Error('Failed to load all products.');
    }
  }

  private async newTokenRequest(): Promise<string> {
    const expiresAt = Date.now() + 6 * 24 * 60 * 60 * 1000;
    const data = fs.readFileSync('whooow_token.json', 'utf8');
    const tokenData = JSON.parse(data);
    if (Date.now() < tokenData.expiresAt) {
      console.log('Valid Token');
      return tokenData.token;
    }

    const req = await this.httpService.axiosRef.post<{
      authorizationCode: string;
    }>(`${this.host}/oauth2/verify`, {
      clientId: this.clientId,
      username: this.userName,
      password: this.password,
    });

    const code = req.data.authorizationCode;

    const tokenReq = await this.httpService.axiosRef.post<{
      token: string;
    }>(`${this.host}/oauth2/token`, {
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      authorizationCode: code,
    });

    fs.writeFileSync(
      'whooow_token.json',
      JSON.stringify({ token: tokenReq.data.token, expiresAt: expiresAt }),
    );
    console.log('Regenrate Token.');
    return tokenReq.data.token;
  }

  async createOrder({
    sku,
    amount,
    id,
    upi,
    user,
  }: {
    sku: string;
    amount: number;
    id: string;
    upi: string;
    user: User;
  }) {
    const token = await this.newTokenRequest();

    const data = await this.httpService.axiosRef.post(
      `${this.host}/rest/v3/orders`,
      {
        address: {
          firstname: 'Jhon',
          email: 'jhon.deo@gmail.com',
          telephone: '+919999999999',
          country: 'IN',
          postcode: '560076',
          billToThis: true,
        },
        isConsolidated: false,
        payments: [
          {
            code: 'svc',
            amount: amount,
            poNumber: 'yes',
          },
        ],
        refno: id,
        syncOnly: true,
        products: [
          {
            sku: sku,
            price: amount,
            qty: 1,
            currency: 356,
            payout: {
              type: 'UPI',
              vpa: upi,
              name: user.name,
              transactionType: 'UPI',
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          dateAtClient: this.date.toISOString(),
        },
      },
    );

    return data.data;
  }

  async getActiveOrders(id: string) {
    const token = await this.newTokenRequest();
    try {
      const data = await this.httpService.axiosRef.get(
        `${this.host}/rest/v3/order/${id}/cards/?offset=0&limit=4`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            dateAtClient: this.date.toISOString(),
          },
        },
      );
      console.log(JSON.stringify(data.data, null, 2));
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  }

  async getOrder(id: string) {
    const token = await this.newTokenRequest();
    try {
      const data = await this.httpService.axiosRef.get(
        `${this.host}/rest/v3/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            dateAtClient: this.date.toISOString(),
          },
        },
      );
      console.log(JSON.stringify(data.data, null, 2));
      return data.data;
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  }
}
