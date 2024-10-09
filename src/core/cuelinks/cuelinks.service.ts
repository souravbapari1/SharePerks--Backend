import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Cuelinks,
  CuelinksDocument,
} from 'src/schemas/cuelinks/cuelinks.schema';

@Injectable()
export class CuelinksService {
  constructor(
    @InjectModel(Cuelinks.name)
    private readonly cuelinkModel: Model<CuelinksDocument>,
  ) {}

  async getAll() {
    const data = await this.cuelinkModel.find();
    return data;
  }

  async getById(id: string) {
    const data = await this.cuelinkModel.findOne({ cuelink_id: id });
    return data;
  }
}
