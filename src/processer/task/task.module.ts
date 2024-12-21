import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { VouchagramModule } from './vouchagram/vouchagram.module';
import { CuelinksModule } from './cuelinks/cuelinks.module';
import { AdmitadModule } from './admitad/admitad.module';
import { CommitionModule } from './commition/commition.module';
import { WhoowApiModule } from './whoow/whoow.module';

@Module({
  imports: [
    VouchagramModule,
    CuelinksModule,
    AdmitadModule,
    CommitionModule,
    WhoowApiModule,
  ],
  providers: [TaskService],
})
export class TaskModule {}
