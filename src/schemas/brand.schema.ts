import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop()
  name: string;

  @Prop()
  btnText: string;

  @Prop()
  linkUrl: string;

  @Prop()
  category: Array<mongoose.Schema.Types.ObjectId>;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  provider: string;

  @Prop()
  stockISIN: string;

  @Prop()
  offerTerms: string;

  @Prop()
  cashBackRates: string;

  @Prop()
  aboutBrand: string;

  @Prop()
  bannerImage: string;

  @Prop()
  brandImage: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
