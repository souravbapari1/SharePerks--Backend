import { Controller, Get, NotAcceptableException, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { isValidObjectId } from 'mongoose';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}
  @Get(':id/:type/:user')
  async link(
    @Param('id') id: string,
    @Param('type') type: 'brand' | 'coupon' | 'offer',
    @Param('user') user: string,
  ) {
    if (!isValidObjectId(user)) {
      throw new NotAcceptableException('Not A Valid user Id');
    }
    if (!isValidObjectId(id)) {
      throw new NotAcceptableException('Not A Valid Tracker Id');
    }
    return await this.trackerService.getLink({ id: id, type, user });
  }
}
