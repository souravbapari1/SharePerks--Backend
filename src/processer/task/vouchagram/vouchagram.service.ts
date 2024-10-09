import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VouchagramToken,
  VouchagramTokenDocument,
} from 'src/schemas/vouchagram/vouchagramtoken.schema';
import {
  PullVoucher,
  VouchagramCreateVoucherRequest,
  VouchagramResponse,
  VouchagramStock,
  VoucherData,
} from './vouchagram';
import * as crypto from 'crypto'; // Use the correct 'crypto' from Node.js
import { AxiosResponse } from 'axios';

import {
  VouchagramStores,
  VouchagramStoresDocument,
} from 'src/schemas/vouchagram/vouchagramStores.schema';
import {
  VouchagramBrands,
  VouchagramBrandsDocument,
} from 'src/schemas/vouchagram/vouchagramBrnds.schema';

@Injectable()
export class VouchagramService {
  private key: string;
  private iv: string;
  private host: string;
  private userName: string;
  private password: string;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(VouchagramToken.name)
    private readonly vouchagramModel: Model<VouchagramTokenDocument>,
    @InjectModel(VouchagramBrands.name)
    private readonly vouchagramBrandsVouchagramBrandsModel: Model<VouchagramBrandsDocument>,
    @InjectModel(VouchagramStores.name)
    private readonly vouchagramStoresModel: Model<VouchagramStoresDocument>,
  ) {
    this.key = '6d66fb7debfd15bf716bb14752b9603b';
    this.iv = '716bb14752b9603b';
    this.host = 'https://send.bulkgv.net/API/v1';
    this.userName = 'ZVBPNPCHVMBUAQTZYOWPLTXVWXWYERDS';
    this.password = ']soLj$si!x6IL![KP~rkQ^sXG^hT3yJS';
  }

  async createVoucher(
    data: VouchagramCreateVoucherRequest,
  ): Promise<VoucherData> {
    const token = await this.getToken();
    const payload = this.encrypt(data);

    const req: AxiosResponse<VouchagramResponse> =
      await this.httpService.axiosRef.post(
        `${this.host}/pullvoucher`,
        { payload },
        {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        },
      );

    if (req.data.code !== '0000') {
      throw new InternalServerErrorException(errorDataSet[req.data.code]);
    }

    const voucherData = this.decrypt(req.data.data);
    const voucher: VoucherData = JSON.parse(voucherData);
    console.log(voucher);

    console.log(voucher.PullVouchers[0]);
    console.log(voucher.PullVouchers[0].Vouchers);

    return voucher;
  }

  async getVoucherStatus(id: string): Promise<VoucherData> {
    const token = await this.getToken(true);
    const payload = this.encrypt({ sv_ex_order_id: id });

    const req: AxiosResponse<VouchagramResponse> =
      await this.httpService.axiosRef.post(
        `${this.host}/pullvoucher/checkstatus`,
        { payload },
        {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        },
      );

    if (req.data.code !== '0000') {
      throw new InternalServerErrorException(errorDataSet[req.data.code]);
    }

    const voucherData = this.decrypt(req.data.data);
    const voucher: VoucherData = JSON.parse(voucherData);
    console.log(voucher);

    console.log(voucher.PullVouchers[0]);
    console.log(voucher.PullVouchers[0].Vouchers);

    return voucher;
  }

  async getStocks(
    BrandProductCode: string,
    Denomination: number,
  ): Promise<VouchagramStock> {
    const token = await this.getToken();
    const payload = this.encrypt({
      BrandProductCode,
      Denomination,
    });

    const req: AxiosResponse<VouchagramResponse> =
      await this.httpService.axiosRef.post(
        `${this.host}/getstock`,
        { payload },
        {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        },
      );

    if (req.data.code !== '0000') {
      throw new InternalServerErrorException(errorDataSet[req.data.code]);
    }

    const data = this.decrypt(req.data.data);
    const stockData: VouchagramStock = JSON.parse(data);
    return stockData as {
      AvailableQuantity: number;
      BrandName: string;
    };
  }

  async getBrands(BrandProductCode?: string, OttRequired?: 'Y' | 'N') {
    try {
      const token = await this.getToken();

      const res: AxiosResponse<VouchagramResponse> =
        await this.httpService.axiosRef.post(
          `${this.host}/getbrands`,
          {
            BrandProductCode,
            OttRequired,
          },
          {
            headers: {
              token: token,
              'Content-Type': 'application/json',
            },
          },
        );

      if (res.data.code !== '0000') {
        console.log(res.data);

        throw new InternalServerErrorException(errorDataSet[res.data.code]);
      }

      // Decrypt the data and ensure it's an array
      const decryptedData = this.decrypt(res.data.data);
      const products = Array.isArray(decryptedData)
        ? decryptedData
        : JSON.parse(decryptedData);

      await this.vouchagramBrandsVouchagramBrandsModel.deleteMany();
      // Prepare the documents for bulk insertion
      const bulkOps = products.map((e) => ({
        updateOne: {
          filter: { brandProductCode: e.BrandProductCode },
          update: { $set: { data: e } },
          upsert: true,
        },
      }));

      // Perform bulk write operation
      await this.vouchagramBrandsVouchagramBrandsModel.bulkWrite(bulkOps);

      // Optionally, you can use this if you still want to fetch the list
      const productsList =
        await this.vouchagramBrandsVouchagramBrandsModel.find();
      return productsList;
    } catch (error) {
      console.error(error); // Log the actual error for better debugging
      throw new InternalServerErrorException(
        'Error getting vouchagram products',
      );
    }
  }

  async getStores(BrandProductCode?: string, shop?: string) {
    try {
      const token = await this.getToken(true);

      const res: AxiosResponse<VouchagramResponse> =
        await this.httpService.axiosRef.post(
          `${this.host}/getstorelist`,
          {
            BrandProductCode,
            shop,
          },
          {
            headers: {
              token: token,
              'Content-Type': 'application/json',
            },
          },
        );

      if (res.data.code !== '0000') {
        throw new InternalServerErrorException(errorDataSet[res.data.code]);
      }

      const storesData = res.data.data; // Assume this is already an object or array

      // Ensure storesData is an array
      if (Array.isArray(storesData)) {
        await this.vouchagramStoresModel.deleteMany();
        // Prepare bulk operations
        const bulkOps = storesData.map((e) => ({
          updateOne: {
            filter: { storeId: e.brand_id },
            update: { $set: { data: e } },
            upsert: true,
          },
        }));

        // Perform bulk write operation
        await this.vouchagramStoresModel.bulkWrite(bulkOps);

        // Optionally, fetch the updated list
        const storesList = await this.vouchagramStoresModel.find();
        return storesList;
      } else {
        throw new InternalServerErrorException('Unexpected data format');
      }
    } catch (error) {
      console.error(error); // Log the actual error for better debugging
      throw new InternalServerErrorException('Error getting vouchagram stores');
    }
  }

  async pullVouchers(data: {
    BrandProductCode: string;
    Denomination: string;
    Quantity: number;
    ExternalOrderId: string;
  }) {
    try {
      const token = await this.getToken(true);
      const payload = this.encrypt(data);
      const res: AxiosResponse<VouchagramResponse> =
        await this.httpService.axiosRef.post(
          `${this.host}/pullvoucher`,
          {
            payload,
          },
          {
            headers: {
              token: token,
              'Content-Type': 'application/json',
            },
          },
        );

      if (res.data.code !== '0000') {
        throw new InternalServerErrorException(errorDataSet[res.data.code]);
      }

      const pullData = JSON.parse(this.decrypt(res.data.data));
      // Ensure storesData is an array
      return pullData;
    } catch (error) {
      console.error(error); // Log the actual error for better debugging
      throw new InternalServerErrorException('Error getting vouchagram stores');
    }
  }

  private async getToken(update: boolean = false): Promise<string> {
    try {
      const tokenData = await this.vouchagramModel.findOne();
      const now = new Date();
      const tokenExpired = tokenData
        ? now.getTime() - new Date(tokenData.generateAt).getTime() >
          25 * 60 * 1000
        : true;

      if (!tokenData || tokenExpired || update) {
        // If token is not found, expired, or update is requested, fetch a new one
        const data = await this.newTokenRequest();
        const token = this.decrypt(data.data.data).replaceAll('"', '');

        // Update existing token data or create a new record
        if (tokenData) {
          await this.vouchagramModel.updateOne(
            { _id: tokenData._id },
            {
              token,
              encToken: data.data.data,
              generateAt: now,
            },
          );
        } else {
          await this.vouchagramModel.create({
            token,
            encToken: data.data.data,
            generateAt: now,
          });
        }

        return token;
      }

      return tokenData.token;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error generating vouchagram token',
      );
    }
  }

  private async newTokenRequest() {
    const data: AxiosResponse<VouchagramResponse> =
      await this.httpService.axiosRef.get(`${this.host}/gettoken`, {
        headers: {
          username: this.userName,
          password: this.password,
          'Content-Type': 'application/json',
        },
      });
    if (data.data.code != '0000') {
      throw new InternalServerErrorException(errorDataSet[data.data.code]);
    }
    return data;
  }

  private encrypt(data: any): string {
    try {
      if (typeof data == 'object') {
        data = JSON.stringify(data);
      }
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      return encrypted;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error encrypting data');
    }
  }

  private decrypt(data: string): string {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        this.key,
        this.iv,
      );
      let decrypted = decipher.update(data, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error decrypting data');
    }
  }
}

const errorDataSet = {
  '0000': 'Process successfully completed',
  ER001: 'Wrong Credentials',
  ER002: 'Wrong Credentials',
  ER003: 'A valid GUID is required for buyer',
  ER006: 'Product GUID is mandatory',
  ER007: 'A valid GUID is required for product',
  ER022: 'Quantity must be numeric',
  ER023: 'Quantity must be greater than 0',
  ER024: 'Unauthorized access',
  ER025: "Inactive Client 'Name of Client'",
  ER032: "Inactive Product 'Name of product'",
  ER041: 'Product is not available',
  ER047:
    'Vouchers are no more available for blast, contact administrator for details',
  ER057: 'IP not whitelisted',
  ER059: 'Max [1] quantity is allowed per product',
  ER062:
    'External ID Product/Brand GUID not mapped with Products/Brand GUID requested',
  ER076: 'Please enter valid BrandProductCode',
  ER077: 'Please enter valid Denomination',
  ER079: 'External order id and previous requested data not matched',
  ER080: 'Multiple products found, Please contact to administrator',
  ER082: 'Error in decrypt data',
  ER083: 'Invalid token',
  ER1000: 'Unexpected error occurred during execution',
  ER1006:
    'Vouchers are no more available for blast, contact administrator for details',
  ER1056: 'Please contact customer service 08510004444',
  ER1057: "Vouchers' requested quantity for required duration is not available",
  ER1011:
    'Error encountered while processing your request. Please try again later or contact administrator for further details',
  EROIP: 'Order/request already in process',
  '1043': 'Please provide valid ExternalOrderId',
  '1048':
    'Error encountered while processing your request. Please try again later or contact administrator for further details',
  '1063': 'Product/Brand not available',
};
