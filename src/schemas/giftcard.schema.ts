import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GiftCardDocument = GiftCard & Document;

@Schema({ timestamps: true })
export class OfflineStoreAddress {
  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  shop_contact: string;
}

export const OfflineStoreAddressSchema =
  SchemaFactory.createForClass(OfflineStoreAddress);

@Schema({ timestamps: true })
export class GiftCard {
  @Prop()
  storeType: string;

  @Prop()
  codeType: string;

  @Prop()
  denominationList: string;

  @Prop({ default: false })
  isEnable: boolean;

  @Prop()
  stockISIN: string;

  @Prop()
  description: string;

  @Prop()
  taq: string;

  @Prop()
  redeemSteps: string;

  @Prop()
  GiftCardImage: string;

  @Prop()
  previewImage: string;

  @Prop()
  brandName: string;

  @Prop()
  OnlineRedemptionUrl: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop()
  inStockPercent: number;

  @Prop()
  withoutStockPercent: number;

  @Prop({ type: OfflineStoreAddressSchema, required: false }) // Make offlineStoreAddress optional
  offlineStoreAddress?: OfflineStoreAddress;
}

export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);
