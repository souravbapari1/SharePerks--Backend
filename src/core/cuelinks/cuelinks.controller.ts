import { Controller, Get, Param } from '@nestjs/common';
import { CuelinksService } from './cuelinks.service';

@Controller('cuelinks')
export class CuelinksController {
  constructor(private cuelinksService: CuelinksService) {}
  @Get()
  async getAll() {
    return await this.cuelinksService.getAll();
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.cuelinksService.getById(id);
  }
}
