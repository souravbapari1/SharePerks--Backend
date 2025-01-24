import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'ADMIN' })
  role: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  permissions: any;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
