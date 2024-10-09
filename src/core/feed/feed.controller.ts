import { Controller, Get, Param } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  @Get(':id?')
  async getFeeds(@Param('id') id?: string) {
    return await this.feedService.getFeed(id);
  }
}
