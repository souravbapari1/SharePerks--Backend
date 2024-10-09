import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { UserDto } from '../user/dto/user.dto';
import { CreateBankDto } from './dto/createBank.dto';
import { Request } from 'express';
import { UpdateBankDto } from './dto/updateBank.dto';

@Controller('bank')
export class BankController {
  constructor(private bankService: BankService) {}

  @Post()
  @UseGuards(AuthUserGuard)
  async createBank(
    @Req() req: Request & { user: UserDto },
    @Body() body: CreateBankDto,
  ) {
    return this.bankService.createBank(req.user, body);
  }

  @Put(':id')
  @UseGuards(AuthUserGuard)
  async updateBank(
    @Req() req: Request & { user: UserDto },
    @Param('id') id: string,
    @Body() body: UpdateBankDto,
  ) {
    return this.bankService.updateBank(id, req.user, body);
  }

  @Delete(':id')
  @UseGuards(AuthUserGuard)
  async deleteBank(@Param('id') id: string) {
    return this.bankService.deleteBank(id);
  }

  @Get(':id')
  @UseGuards(AuthUserGuard)
  async getBank(@Param('id') id: string) {
    return this.bankService.getBank(id);
  }

  @Get()
  @UseGuards(AuthUserGuard)
  async getBanks(@Req() req: Request & { user: UserDto }) {
    return this.bankService.getBanks(req.user._id);
  }
}
