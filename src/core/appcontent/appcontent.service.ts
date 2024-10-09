import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from 'src/schemas/content.schma';

@Injectable()
export class AppcontentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async getData(id: string) {
    const data = await this.contentModel.findOne({ content_id: id });
    return data || { content_id: id, data: '' };
  }

  async updateData(id: string, data: any) {
    return await this.contentModel.updateOne(
      { content_id: id }, // Query to find the document
      { data }, // Update operation
      { upsert: true }, // Create a new document if it doesn't exist
    );
  }
}
