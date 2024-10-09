export type AdmitedToken = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  id: number;
  group: string;
  code: string;
};

export type AdmitedResponse = {
  results: AdmitedTransions[];
  _meta: {
    count: number;
    limit: number;
    offset: number;
  };
};

export type AdmitedTransions = {
  status: string;
  comment: any;
  conversion_time: number;
  keyword: any;
  advcampaign_name: string;
  advcampaign_id: number;
  cart?: number;
  subid: any;
  subid1: any;
  subid2: any;
  subid3: any;
  subid4: any;
  click_user_referer: any;
  currency: string;
  action_date: string;
  website_name: string;
  action: string;
  click_date: string;
  payment: number;
  tariff_id: number;
  banner_id: number;
  action_id: number;
  processed: number;
  paid: number;
  order_id: string;
  closing_date: string;
  action_type: string;
  promocode: string;
  status_updated: string;
  positions: Array<{
    tariff_id: number;
    payment: string;
    rate: any;
    datetime: string;
    amount: string;
    percentage: boolean;
    product_url: string;
    id: number;
  }>;
};
