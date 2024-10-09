import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from 'src/schemas/bank.schema';
import { LogModule } from 'src/global/log/log.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
    LogModule,
  ],
  controllers: [BankController],
  providers: [BankService],
})
export class BankModule {}
