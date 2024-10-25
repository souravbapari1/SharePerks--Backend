import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdmitadDocument = HydratedDocument<Admitad>;

interface DataStructure {
  key1: string;
  key2: number;
}

@Schema({ timestamps: true })
export class Admitad {
  @Prop({})
  cam_id: number;

  @Prop({ type: Object })
  data: DataStructure;
}

export const AdmitadSchema = SchemaFactory.createForClass(Admitad);
