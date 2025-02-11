import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReferRewardDocument = HydratedDocument<ReferReward>;

@Schema({ timestamps: true })
export class ReferReward {
  @Prop({ default: 0 })
  refererAmount: number;

  @Prop({ default: 0 })
  referralAmount: number;
}

export const ReferRewardSchema = SchemaFactory.createForClass(ReferReward);
