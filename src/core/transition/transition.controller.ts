import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TransitionService } from './transition.service';
import { AuthUserGuard } from 'src/guards/user.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateTransitionsDto } from './dto/createTransitions.dto';
import { UpdateTransitionsDto } from './dto/updateTransitions.dto';

@Controller('transition')
export class TransitionController {
  constructor(private transitionService: TransitionService) {}

  @Get('all')
  async getAllTransition() {
    return await this.transitionService.getAllTransitions();
  }

  @Get(':id')
  @UseGuards(AuthUserGuard)
  async getUserAllTransition(@Param('id') id: string) {
    return await this.transitionService.getUserTransitions(id);
  }

  @Get('status/:id')
  @UseGuards(AuthUserGuard)
  async getUserAllTransitionStats(@Param('id') id: string) {
    return await this.transitionService.paymentInfo(id);
  }

  @Get(':id/:type')
  @UseGuards(AuthUserGuard)
  async getUserAllTransitionType(
    @Param('id') id: string,
    @Param('type') type: string,
  ) {
    return await this.transitionService.getUserTransitionsType(id, type);
  }

  @UseGuards(AdminGuard)
  async createTransition(@Body() body: CreateTransitionsDto) {
    return await this.transitionService.createUserTransition(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateTransition(
    @Body() body: UpdateTransitionsDto,
    @Param('id') id: string,
  ) {
    return await this.transitionService.updateUserTransition(body, id);
  }
}
