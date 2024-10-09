import { Module } from '@nestjs/common';
import { CuelinksService } from './cuelinks.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Cuelinks, CuelinksSchema } from 'src/schemas/cuelinks/cuelinks.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Cuelinks.name, schema: CuelinksSchema },
    ]),
  ],
  providers: [CuelinksService],
  exports: [CuelinksService],
})
export class CuelinksModule {}
