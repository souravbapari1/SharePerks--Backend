import {
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Query,
} from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { isValidObjectId } from 'mongoose';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) { }
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

  @Get('click-activity')
  async clickActivity(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return await this.trackerService.logClick(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get('all')
  async allLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 40,
    @Query('search') search: string = '',
  ) {
    return await this.trackerService.logAll(
      Number(page),
      Number(limit),
      search,
    );
  }
}
