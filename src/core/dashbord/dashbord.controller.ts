import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { DashbordService } from './dashbord.service';

@Controller('dashbord')
export class DashbordController {
  constructor(private readonly dashboardService: DashbordService) {}
  @Get()
  @UseGuards(AdminGuard)
  async get() {
    return await this.dashboardService.getStatus();
  }
}
