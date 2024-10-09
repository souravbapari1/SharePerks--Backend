import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Cuelinks,
  CuelinksDocument,
} from 'src/schemas/cuelinks/cuelinks.schema';
import {
  CueLinkTransitions,
  TCampaign,
  Transaction,
  TransitionsData,
} from './cuelinks';

@Injectable()
export class CuelinksService {
  private token: string;
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Cuelinks.name)
    private readonly cuelinkModel: Model<CuelinksDocument>,
  ) {
    this.token = 'gz4e5t7FjdE9hccm6clcSGzk2YKeso8MAbVnPgCzAg8';
  }

  async getCompanies() {
    try {
      const total = await this.totalCampaigns();
      const pages = Math.ceil(total / 50);
      console.log(total, pages);

      await this.cuelinkModel.deleteMany();
      for (let i = 0; i < pages; i++) {
        const data = await this.httpService.axiosRef.get<TCampaign>(
          `https://www.cuelinks.com/api/v2/campaigns.json?country_id=252&per_page=50&page=${i + 1}`,
          {
            headers: {
              Authorization: 'Token token=' + this.token,
              'Content-Type': 'application/json',
            },
          },
        );

        const storeData = data.data.campaigns.map((e) => {
          return {
            cuelink_id: e.id.toString(),
            data: e,
          };
        });

        for (let x = 0; x < storeData.length; x++) {
          const element = storeData[x];
          try {
            await this.cuelinkModel.create(element);
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async totalCampaigns(): Promise<number> {
    const data = await this.httpService.axiosRef.get(
      `https://www.cuelinks.com/api/v2/campaigns/count.json?country_id=252`,
      {
        headers: {
          Authorization: 'Token token=' + this.token,
          'Content-Type': 'application/json',
        },
      },
    );
    return data.data.campaigns.count;
  }

  async getLast30DaysTransactions(): Promise<TransitionsData<Transaction>[]> {
    // Get the current date and date 30 days ago
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);

    // Format dates to ISO strings (required format by the API)
    const startDate = pastDate.toISOString().slice(0, 19); // Trimming to remove milliseconds
    const endDate = currentDate.toISOString().slice(0, 19);

    const url = `https://www.cuelinks.com/api/v2/transactions.json?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&per_page=1000000`;

    const { data } = await this.httpService.axiosRef.get<CueLinkTransitions>(
      url,
      {
        headers: {
          Authorization: 'Token token=' + this.token,
          'Content-Type': 'application/json',
        },
      },
    );

    const transitionsData: TransitionsData<Transaction>[] =
      data.transactions.map((e) => {
        return {
          provider_id: `cuelinks_${e.id}`,
          amount: e.sale_amount,
          commission: e.user_commission,
          status: e.status,
          currency: e.currency,
          store_name: e.store_name,
          userId: e.subid1,
          provider: 'cuelinks',
          type: e.subid2,
          typeId: e.subid3,
          data: JSON.parse(e.subid4),
          date: e.transaction_date,
          response: e,
        };
      });

    return transitionsData as TransitionsData<Transaction>[];
  }
}
