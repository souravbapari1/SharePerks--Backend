import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AdmitedResponse,
  AdmitedToken,
  AdmitedTransions,
  AdvCampaigns,
  Result,
} from './admitad';
import { TransitionsData } from '../cuelinks/cuelinks';
import { TransitionService } from 'src/core/transition/transition.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/schemas/brand.schema';
import { Offers, OffersDocument } from 'src/schemas/offers.schema';
import { Coupon, CouponDocument } from 'src/schemas/coupons.schema';
import {
  Transitions,
  TransitionsDocument,
} from 'src/schemas/transitions.schema';
import { TransitionsType } from 'src/constants/constents';
import { Admitad, AdmitadDocument } from 'src/schemas/admitad/admitad.schema';

@Injectable()
export class AdmitadService {
  // Client ID for the Admitad API
  private clientId: string;

  // Authorization key for the Admitad API
  private authorizationKey: string;

  // Injected services
  constructor(
    // HTTP service for making API requests
    private readonly httpService: HttpService,

    // Service for handling transitions
    private readonly transitionService: TransitionService,

    // Injected models
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Admitad.name)
    private readonly admitadModel: Model<AdmitadDocument>,

    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,

    @InjectModel(Offers.name)
    private readonly offersModel: Model<OffersDocument>,

    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    @InjectModel(Transitions.name)
    private readonly transitionsModel: Model<TransitionsDocument>,
  ) {
    // Load environment variables from the ConfigService
    this.clientId = 'v0E8xyoCVVFasjXkvMTnbCgUe5uyMJ';
    this.authorizationKey =
      'djBFOHh5b0NWVkZhc2pYa3ZNVG5iQ2dVZTV1eU1KOklVYjF3dTU1bUVxcGczMTFHUWNxTTRsZ1NNSmtyRg==';
  }

  // Helper function to format dates in dd.mm.yyyy format
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (January is 0)
    const year = date.getFullYear();

    return `${day}.${month}.${year}`; // Return date in dd.mm.yyyy format
  }

  // New method to fetch action statistics for the last 30 days
  async getActionStatisticsForLast30Days(): Promise<
    TransitionsData<AdmitedTransions>[]
  > {
    try {
      const token = await this.getTokens(); // Fetch the Bearer token

      // Calculate the date range using native JavaScript Date object
      const today = new Date();
      const date30DaysAgo = new Date();
      date30DaysAgo.setDate(today.getDate() - 30); // Subtract 30 days from today

      const dateStart = this.formatDate(date30DaysAgo); // Format date 30 days ago
      const dateEnd = this.formatDate(today); // Format today's date

      // Construct the API endpoint URL
      const url = `https://api.admitad.com/statistics/actions/?date_start=${dateStart}&date_end=${dateEnd}`;

      // Set up the headers for the request
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // Make the API request
      const response = await this.httpService.axiosRef.get<AdmitedResponse>(
        url,
        { headers },
      );

      // Process the response data and map to TransitionsData structure
      const tdata: TransitionsData<AdmitedTransions>[] =
        response.data.results.map((e) => {
          let parsedData = null;
          try {
            // Attempt to parse the subid4 field as JSON
            parsedData = e.subid4 ? JSON.parse(e.subid4) : null;
          } catch (err) {
            // Log a warning if there's an error parsing subid4
            console.warn(
              `Error parsing subid4 for action ID ${e.action_id}:`,
              err,
            );
          }

          return {
            // Generate a unique provider ID using the order ID
            provider_id: `admitad_${e.order_id}`,
            // Set the amount and commission to 0
            amount: 0,
            commission: 0,
            // Use the status from the Admitad API
            status: e.status,
            // Use the currency from the Admitad API
            currency: e.currency,
            // Use the website name from the Admitad API
            store_name: e.website_name,
            // Use the subid field as the user ID
            userId: e.subid || '', // Handle potential null subid
            // Set the provider to admitad
            provider: 'admitad',
            // Use the subid2 field as the type
            type: e.subid2 || '', // Handle potential null subid2
            // Use the subid3 field as the type ID
            typeId: e.subid3 || '', // Handle potential null subid3
            // Set the parsed subid4 data
            data: parsedData, // Parsed subid4 data
            // Set the date from the Admitad API
            date: e.action_date,
            // Attach the original response for reference
            response: e, // Attach the original response for reference
          } as TransitionsData<AdmitedTransions>;
        });

      return tdata;
    } catch (error) {
      // Improved error handling with clearer message
      console.log(error.response);

      // Throw an error with a clearer message
      throw new Error(
        `Error fetching action statistics for the last 30 days: ${error.message}`,
      );
    }
  }

  async storeAllCompanies() {
    const token = await this.getTokens();
    let page = 0;
    const limit = 500;
    let data: {
      cam_id: number;
      data: Result;
    }[] = [];
    while (true) {
      try {
        const url = `https://api.admitad.com/advcampaigns/?country=in&language=en&limit=${limit}&currency=INR&offset=${limit * page}`;

        // Set up the headers for the request
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        };

        // Make the API request
        const response = await this.httpService.axiosRef.get<AdvCampaigns>(
          url,
          { headers },
        );

        // Process the response data and map to TransitionsData structure

        const indianData = response.data.results.filter((e) => {
          return e.currency.toLowerCase() === 'inr';
        });

        data = [
          ...data,
          ...indianData.map((e) => {
            return {
              cam_id: e.id,
              data: e,
            };
          }),
        ];
        console.log(data.length, page);

        if (response.data.results.length == 0) {
          console.log('Data Base Entry', data.length);
          await this.admitadModel.deleteMany();
          await this.admitadModel.insertMany(data);
          data = [];
          break;
        }
      } catch (error) {
        break;
      }
      page++;
    }
  }

  // Private helper function to fetch the Bearer token
  private async getTokens(): Promise<string> {
    const url = `https://api.admitad.com/token/?grant_type=client_credentials&client_id=${this.clientId}&scope=advcampaigns%20banners%20websites%20coupons%20banners%20statistics`;

    // Set up the headers for the request
    const headers = {
      Authorization: `Basic ${this.authorizationKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Make the API request
    try {
      const response = await this.httpService.axiosRef.post<AdmitedToken>(
        url,
        null,
        {
          headers,
        },
      );
      return response.data.access_token;
    } catch (error) {
      // Throw an error with a clearer message
      throw new Error(`Error fetching token: ${error.message}`);
    }
  }
}
