import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type OffersDocument = HydratedDocument<Offers>;

@Schema({ timestamps: true })
export class Offers {
  @Prop()
  aboutOffer: string;

  @Prop()
  brandId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  clicks: number;

  @Prop()
  commissionRate: number;

  @Prop()
  commissionType: string;

  @Prop()
  expDate: Date;

  @Prop()
  id: string;

  @Prop()
  bannerImage: string;

  @Prop()
  offerImage: string;

  @Prop({ default: true })
  isEnable: boolean;

  @Prop({ default: false })
  isInSlide: boolean;

  @Prop()
  link: string;

  @Prop()
  linkText: string;

  @Prop()
  category: mongoose.Schema.Types.ObjectId;

  @Prop()
  offerKeyPoints: string;

  @Prop()
  offerTitle: string;

  @Prop()
  provider: string;

  @Prop()
  stockISIN: string;
}

export const OffersSchema = SchemaFactory.createForClass(Offers);
