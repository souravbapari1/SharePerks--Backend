import { Module } from '@nestjs/common';
import { CashFreeService } from './cash-free.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CashFreeService],
  exports: [CashFreeService],
})
export class CashFreeModule {}
