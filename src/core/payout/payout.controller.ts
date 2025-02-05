import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { CreatePayoutDto } from './dto/createPayout.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdatePayoutDto } from './dto/updatePayout.dto';

@Controller('payout')
export class PayoutController {
  constructor(private payoutService: PayoutService) {}

  @UseGuards(AdminGuard)
  @Get('/all')
  async getRequestAll() {
    return await this.payoutService.getPayouts();
  }

  @UseGuards(AdminGuard)
  @Get('/all/:page/:limit')
  async getPagination(
    @Param('page') page: string,
    @Param('limit') limit: string,
  ) {
    return await this.payoutService.getPaginationPayouts(+page, +limit);
  }

  @UseGuards(AuthUserGuard)
  @Post()
  async newRequest(@Body() body: CreatePayoutDto) {
    return await this.payoutService.createNewPayout(body);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async updateRequest(@Body() body: UpdatePayoutDto, @Param('id') id: string) {
    return await this.payoutService.updatePayout(body, id);
  }
  @UseGuards(AuthUserGuard)
  @Get(':id')
  async getRequest(@Param('id') id: string) {
    return await this.payoutService.getUserPayouts(id);
  }

  @UseGuards(AuthUserGuard)
  @Get('all/filter/:status')
  async getRequestAllFilter(@Param('status') status: string) {
    return await this.payoutService.getPayoutsFilter(status);
  }

  @UseGuards(AuthUserGuard)
  @Get('all/filter/:status/:page/:limit')
  async getPaginationPagination(
    @Param('status') status: string,
    @Param('page') page: string,
    @Param('limit') limit: string,
  ) {
    return await this.payoutService.getPayoutsFilterPagination(
      status,
      +page,
      +limit,
    );
  }

  @UseGuards(AuthUserGuard)
  @Get(':id/filter/:status')
  async getRequestFilter(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    return await this.payoutService.getUserPayoutsFilter(id, status);
  }
}
