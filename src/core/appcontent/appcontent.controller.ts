import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppcontentService } from './appcontent.service';

@Controller('appcontent')
export class AppcontentController {
  constructor(private contentService: AppcontentService) {}
  @Get(':id')
  async getData(@Param('id') id: string) {
    return await this.contentService.getData(id);
  }

  @Post(':id')
  async updateData(@Param('id') id: string, @Body() data: { data: any }) {
    return await this.contentService.updateData(id, data.data);
  }
}
