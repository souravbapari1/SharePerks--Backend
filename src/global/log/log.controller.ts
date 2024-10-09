import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { LogDto } from './log.dto';
import { AuthUserGuard } from 'src/guards/user.guard';

@Controller('log')
@UseGuards(AuthUserGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Post()
  async createLog(@Body() body: LogDto) {
    await this.logService.createNewLog(body);
    return { status: true, message: 'log added Successfully' };
  }
}
