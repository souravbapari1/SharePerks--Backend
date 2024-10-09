import { Module } from '@nestjs/common';
import { AppcontentController } from './appcontent.controller';
import { AppcontentService } from './appcontent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from 'src/schemas/content.schma';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  controllers: [AppcontentController],
  providers: [AppcontentService],
})
export class AppcontentModule {}
