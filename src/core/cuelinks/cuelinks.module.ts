import { Module } from '@nestjs/common';
import { CuelinksController } from './cuelinks.controller';
import { CuelinksService } from './cuelinks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cuelinks, CuelinksSchema } from 'src/schemas/cuelinks/cuelinks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cuelinks.name, schema: CuelinksSchema },
    ]),
  ],
  controllers: [CuelinksController],
  providers: [CuelinksService],
})
export class CuelinksModule {}
