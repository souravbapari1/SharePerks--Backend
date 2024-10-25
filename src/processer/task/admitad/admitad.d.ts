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

export interface AdvCampaigns {
  results: Result[];
  _meta: Meta;
}

export interface Result {
  id: number;
  name: string;
  name_aliases: string;
  site_url: string;
  description: string;
  raw_description: string;
  currency: string;
  rating: string;
  ecpc: number;
  epc: number;
  cr: number;
  regions: Region[];
  categories: Category[];
  status: string;
  image: string;
  ecpc_trend: any;
  epc_trend: any;
  cr_trend: any;
  exclusive: boolean;
  activation_date: string;
  modified_date: string;
  denynewwms: boolean;
  goto_cookie_lifetime: number;
  retag: boolean;
  show_products_links: boolean;
  landing_code: any;
  landing_title: any;
  geotargeting: boolean;
  max_hold_time: any;
  traffics: Traffic[];
  avg_hold_time: number;
  avg_money_transfer_time: number;
  allow_deeplink: boolean;
  coupon_iframe_denied: boolean;
  action_testing_limit: any;
  mobile_device_type: any;
  mobile_os: any;
  mobile_os_type: any;
  allow_actions_all_countries: boolean;
  connected: boolean;
  advertiser_legal_info: string;
  action_countries: string[];
  actions: Action[];
  action_type: string;
  individual_terms: boolean;
  rate_of_approve: string;
  more_rules: string;
}

export interface Region {
  region: string;
}

export interface Category {
  name: string;
  id: number;
  language: string;
  parent?: Parent;
}

export interface Parent {
  name: string;
  id: number;
  language: string;
  parent: any;
}

export interface Traffic {
  id: number;
  name: string;
  enabled: boolean;
}

export interface Action {
  id: number;
  name: string;
  type: string;
  payment_size: string;
  hold_time: number;
}

export interface Meta {
  limit: number;
  offset: number;
  count: number;
}
