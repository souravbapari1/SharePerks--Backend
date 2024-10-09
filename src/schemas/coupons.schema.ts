import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop()
  aboutCoupon: string;

  @Prop()
  brandId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  clicks: number;

  @Prop()
  code: string;

  @Prop()
  commissionRate: number;

  @Prop()
  commissionType: string;

  @Prop()
  expDate: Date;

  @Prop()
  bannerImage: string;

  @Prop()
  couponImage: string;

  @Prop({ default: false })
  isEnable: boolean;

  @Prop()
  link: string;

  @Prop()
  linkText: string;

  @Prop()
  category: mongoose.Schema.Types.ObjectId;

  @Prop()
  couponKeyPoints: string[];

  @Prop()
  couponTitle: string;

  @Prop()
  provider: string;

  @Prop()
  stockISIN: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
